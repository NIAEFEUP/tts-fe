import json

from django.utils import timezone

from tts_be.settings import CONFIG, DEBUG

from django.db.models import Q

from rest_framework.views import APIView
from django.core.paginator import Paginator
from django.http import HttpResponse, JsonResponse
from django.db.models import Prefetch

from datetime import datetime

from django.db import transaction

from university.controllers.ExchangeController import ExchangeController
from university.controllers.SigarraController import SigarraController
from university.exchange.utils import ExchangeStatus, build_marketplace_submission_schedule, build_student_schedule_dict, incorrect_class_error
from university.models import CourseUnit, Class
from university.utils.ExchangeHasher import ExchangeHasher
from exchange.models import MarketplaceExchange, MarketplaceExchangeClass, UserCourseUnits, ExchangeUrgentRequests, ExchangeUrgentRequestOptions
from university.serializers.MarketplaceExchangeClassSerializer import MarketplaceExchangeClassSerializer

class MarketplaceExchangeView(APIView):
    def build_pagination_payload(self, request, exchanges):
        page_number = request.GET.get("page")
        paginator = Paginator(exchanges, 15)
        page_obj = paginator.get_page(page_number if page_number != None else 1)

        return {
            "page": {
                "current": page_obj.number,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
            },
            "data": [{
                "id": exchange.id,
                "type": "marketplaceexchange",
                "issuer_name": exchange.issuer_name,
                "issuer_nmec": exchange.issuer_nmec,
                "options": [
                    MarketplaceExchangeClassSerializer(exchange_class).data for exchange_class in exchange.options
                ],
                "classes": list(ExchangeController.getExchangeOptionClasses(exchange.options)),
                "date":  exchange.date,
                "accepted": exchange.accepted
            } for exchange in page_obj]
        }

    def filterAllExchanges(self, request, course_unit_name_filter, classes_filter):
        marketplace_exchanges = list(MarketplaceExchange.objects
                .prefetch_related(
                Prefetch(
                    'marketplaceexchangeclass_set',
                    to_attr='options'
                )
                ).exclude(Q(issuer_nmec=request.user.username) | Q(canceled=True) | Q(accepted=True)).distinct())

        if not DEBUG:
            marketplace_exchanges = self.remove_invalid_dest_class_exchanges(marketplace_exchanges, request.user.username)

        marketplace_exchanges = self.advanced_classes_filter(marketplace_exchanges, classes_filter)

        if course_unit_name_filter:
            marketplace_exchanges = list(filter(
                lambda x: ExchangeController.courseUnitNameFilterInExchangeOptions(x.options, course_unit_name_filter),
                marketplace_exchanges
            ))

        return self.build_pagination_payload(request, marketplace_exchanges)

    def remove_invalid_dest_class_exchanges(self, marketplace_exchanges, nmec):
        """
            Classes where the destination class the requester user will go to is not a class we are in should not be shown in exchange
        """
        user_ucs_map = {uc.course_unit.id: uc for uc in list(UserCourseUnits.objects.filter(user_nmec=nmec))}

        exchanges_with_valid_dest_class = []
        for exchange in marketplace_exchanges:
            add_to_result = False
            for option in exchange.options:
                course_unit_id = option.course_unit_id
                class_issuer_goes_to = option.class_issuer_goes_to
                if int(course_unit_id) in user_ucs_map.keys():
                    if Class.objects.filter(course_unit_id=course_unit_id, name=class_issuer_goes_to).get().id == user_ucs_map[int(course_unit_id)].class_field.id:
                        add_to_result = True

            if add_to_result:
                exchanges_with_valid_dest_class.append(exchange)

        return exchanges_with_valid_dest_class

    def advanced_classes_filter(self, marketplace_exchanges, classes_filter):
        filtered_marketplace_exchanges = []
        for exchange in marketplace_exchanges:
            exchange_tainted = False
            for option in exchange.options:
                if option.course_unit_acronym in classes_filter.keys():
                    correct_class_included = option.class_issuer_goes_from in classes_filter[option.course_unit_acronym]
                    exchange_tainted = not correct_class_included

            if not exchange_tainted:
                filtered_marketplace_exchanges.append(exchange)

        return filtered_marketplace_exchanges

    """
        Returns all the current marketplace exchange requests paginated
    """
    def get(self, request):
        courseUnitNameFilter = request.query_params.get('courseUnitNameFilter', None)
        classesFilter = ExchangeController.parseClassesFilter(request.query_params.get('classesFilter', None))

        return JsonResponse(self.filterAllExchanges(request, courseUnitNameFilter.split(',') if courseUnitNameFilter else None, classesFilter), safe=False)

    def post(self, request):
        return self.submit_marketplace_exchange_request(request)
    
    def validate_exchange_periods(self, exchanges):
        for exchange in exchanges:
            course_unit_id = int(exchange["courseUnitId"])
            if not ExchangeController.is_exchange_period_open_for_course_unit(course_unit_id):
                return JsonResponse(
                    {"error": f"O período de trocas não se encontra aberto para a(s) UC(s) selecionada(s)."},
                    status=400,
                    safe=False
                )
        return None

    def submit_marketplace_exchange_request(self, request):
        exchanges = request.POST.getlist('exchangeChoices[]')
        exchanges = list(map(lambda exchange : json.loads(exchange), exchanges))

        if len(exchanges) == 0:
            return JsonResponse({"error": "Pedido vazio"}, status=400, safe=False)

        period_validation_error = self.validate_exchange_periods(exchanges)
        if period_validation_error:
            return period_validation_error

        # If user sent a message explaining why their request should be directly handled by the commission instead of having to be
        # accepted by students in the marketplace
        urgent_message = request.POST.get('urgentMessage')
        is_urgent = urgent_message is not None and urgent_message != ""

        curr_student = request.user.username
        sigarra_res = SigarraController().get_student_schedule(curr_student)

        if(sigarra_res.status_code != 200):
            return HttpResponse(status=sigarra_res.status_code)

        student_schedules = {}
        student_schedules[curr_student] = build_student_schedule_dict(sigarra_res.data)

        student_schedule = list(student_schedules[curr_student].values())
        ExchangeController.update_schedule_accepted_exchanges(curr_student, student_schedule)
        student_schedules[curr_student] = build_student_schedule_dict(student_schedule)

        (status, new_marketplace_schedule) = build_marketplace_submission_schedule(student_schedules, exchanges, curr_student)
        if status == ExchangeStatus.STUDENTS_NOT_ENROLLED:
            return JsonResponse({"error": incorrect_class_error()}, status=400, safe=False)

        if not is_urgent:
            if ExchangeController.exchange_overlap(student_schedules, curr_student):
                return JsonResponse({"error": "classes-overlap"}, status=400, safe=False)

        replace = request.POST.get('replace', 'false') == 'true'
        exchange_hash = ExchangeHasher.hash(exchanges, username=curr_student)

        if is_urgent:
            return self.add_urgent_exchange(request, exchanges, urgent_message, exchange_hash, replace)
        else:
            return self.add_normal_marketplace_exchange(request, exchanges, exchange_hash, replace)


    def add_urgent_exchange(self, request, exchanges, message: str, exchange_hash, replace):
        period_validation_error = self.validate_exchange_periods(exchanges)
        if period_validation_error:
            return period_validation_error

        with transaction.atomic():
            if replace:
                self.reject_old_urgent_requests(request.user, exchange_hash)
            elif ExchangeUrgentRequests.objects.filter(hash=exchange_hash, admin_state="untreated").exists():
                # Replace not set to true and an untreated exchange with the same hash already exists => return error
                return JsonResponse({"error": "duplicate-request"}, status=400, safe=False)

            urgent_request = ExchangeUrgentRequests.objects.create(
                issuer_name=request.user.first_name + " " + request.user.last_name,
                issuer_nmec=request.user.username,
                message=message,
                accepted=False,
                admin_state="untreated",
                date=datetime.now(),
                hash=exchange_hash
            )
            urgent_request.save()

            models_to_save = []
            for exchange in exchanges:
                models_to_save.append(ExchangeUrgentRequestOptions(
                    course_unit_id=int(exchange["courseUnitId"]),
                    class_issuer_goes_from=exchange["classNameRequesterGoesFrom"],
                    class_issuer_goes_to=exchange["classNameRequesterGoesTo"],
                    exchange_urgent_request=urgent_request,
                ))
            ExchangeUrgentRequestOptions.objects.bulk_create(models_to_save)

        return JsonResponse({"success": True}, safe=False)

    def reject_old_urgent_requests(self, user, exchange_hash):
        with transaction.atomic():
            old_requests = ExchangeUrgentRequests.objects.filter(
                issuer_nmec=user.username,
                hash=exchange_hash,
                admin_state="untreated"
            )
            for old_request in old_requests:
                old_request.admin_state = "rejected"
                old_request.save()

    def add_normal_marketplace_exchange(self, request, exchanges, exchange_hash, replace):
        error = self.insert_marketplace_exchange(exchanges, request.user, exchange_hash, replace)
        if error:
            return error

        return JsonResponse({"success": True}, safe=False)

    def insert_marketplace_exchange(self, exchanges, user, exchange_hash, replace):
        issuer_name = f"{user.first_name} {user.last_name.split(' ')[-1]}"

        with transaction.atomic():
            if replace:
                self.cancel_old_marketplace_exchanges(user, exchange_hash)
            elif MarketplaceExchange.objects.filter(hash=exchange_hash, canceled=False).exists():
                # Replace not set to true and a non-canceled exchange with the same hash already exists => return error
                return JsonResponse({"error": "duplicate-request"}, status=400, safe=False)

            marketplace_exchange = MarketplaceExchange.objects.create(
                issuer_name=issuer_name,
                issuer_nmec=user.username,
                accepted=False,
                hash=exchange_hash,
                canceled=False,
                date=timezone.now()
            )
            for exchange in exchanges:
                course_unit_id = int(exchange["courseUnitId"])
                course_unit = CourseUnit.objects.get(pk=course_unit_id)
                MarketplaceExchangeClass.objects.create(
                    marketplace_exchange=marketplace_exchange,
                    course_unit_acronym=course_unit.acronym,
                    course_unit_id=course_unit_id,
                    course_unit_name=course_unit.name,
                    class_issuer_goes_from=exchange["classNameRequesterGoesFrom"],
                    class_issuer_goes_to=exchange["classNameRequesterGoesTo"]
                )

        return None

    def cancel_old_marketplace_exchanges(self, user, exchange_hash):
        with transaction.atomic():
            old_exchanges = MarketplaceExchange.objects.filter(
                issuer_nmec=user.username,
                hash=exchange_hash,
                canceled=False
            )
            for old_exchange in old_exchanges:
                old_exchange.canceled = True
                old_exchange.save()
