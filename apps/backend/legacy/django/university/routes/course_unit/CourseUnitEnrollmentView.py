import json
from rest_framework.views import APIView
from exchange.models import CourseUnitEnrollments, CourseUnitEnrollmentOptions, UserCourseUnits, ExchangeAdmin
from university.serializers.CourseUnitEnrollmentsSerializer import CourseUnitEnrollmentsSerializer
from university.controllers.CourseUnitController import CourseUnitController
from university.controllers.AdminRequestFiltersController import AdminRequestFiltersController
from university.controllers.ExchangeController import ExchangeController


from django.utils import timezone
from django.core.paginator import Paginator

from django.db import transaction

from django.http import HttpResponse, JsonResponse

class CourseUnitEnrollmentView(APIView):
    def __init__(self):
        self.filter_actions = {
            "activeCourse": self.filter_active_course,
            "activeCurricularYear": self.filter_active_curricular_year,
            "activeStates": self.filter_active_state
        }

    def filter_active_course(self, exchanges, major_id):
        return list(
            filter(
                lambda exchange: len(list(
                    filter(
                        lambda course_unit: int(CourseUnitController.course_unit_major(course_unit.get("course_unit").get("id"))) == int(major_id), exchange.get("options"))
                    )) > 0,
                exchanges
            )
        )

    def filter_active_curricular_year(self, exchanges, curricular_year):
        return list(
            filter(
                lambda exchange: len(list(
                    filter(
                        lambda course_unit: int(CourseUnitController.course_unit_curricular_year(course_unit.get("course_unit").get("id"))) == int(curricular_year), exchange.get("options"))
                    )) > 0,
                exchanges
            )
        )

    def filter_active_state(self, exchanges, state):
        states = state.split(",")
        return list(
            filter(
                lambda exchange: exchange.admin_state in states,
                exchanges
            )
        )

    def get(self, request):
        is_admin = ExchangeAdmin.objects.filter(username=request.user.username).exists()
        if not(is_admin):
            return HttpResponse(status=403)

        enrollments = CourseUnitEnrollments.objects.all().order_by('date')

        for filter in AdminRequestFiltersController.filter_values():
            if request.GET.get(filter):
                enrollments = self.filter_actions[filter](enrollments, request.GET.get(filter))

        paginator = Paginator(enrollments, 10)
        page_number = request.GET.get("page")
        enrollments = [x for x in paginator.get_page(page_number if page_number != None else 1)]

        enrollments = CourseUnitEnrollmentsSerializer(enrollments, many=True).data

        return JsonResponse({
            "enrollments": enrollments,
            "total_pages": paginator.num_pages
        }, safe=False)
    
    def post(self, request):
        enrollments = request.POST.getlist("enrollCourses[]")

        if(len(enrollments) == 0):
            return JsonResponse({"error": "Pedido vazio"}, status=400)

        student_course_units = list(UserCourseUnits.objects.filter(user_nmec=request.user.username).all())

        user_nmec = request.user.username
        user_name = f"{request.user.first_name} {request.user.last_name}"

        if len(user_nmec) > 9:
            user_nmec = request.user.email[2:11]

        with transaction.atomic():
            course_unit_enrollment = CourseUnitEnrollments(
                user_nmec=user_nmec,
                user_name=user_name,
                accepted=False,
                admin_state="untreated",
                date=timezone.now()
            )

            models_to_save = []
            for enrollment in enrollments:
                enrollment_metadata = json.loads(enrollment)
                course_unit_id=int(enrollment_metadata["course_unit_id"])

                if not ExchangeController.is_exchange_period_open_for_course_unit(course_unit_id):
                    return JsonResponse({"error":f"O período de trocas encontra-se encerrado para a UC {course_unit_id}."},
                    status=400
                )

                if len(list(CourseUnitEnrollmentOptions.objects.filter(course_unit__id=int(enrollment_metadata["course_unit_id"]), course_unit_enrollment__user_nmec=request.user.username, enrolling=enrollment_metadata["enrolling"]))) > 0:
                    return JsonResponse({"error": "Não podes fazer pedidos com disciplinas em que já pediste noutros!"}, status=400)

                if enrollment_metadata["enrolling"] and len(list(filter(lambda x: int(x.course_unit_id) == int(enrollment_metadata["course_unit_id"]), student_course_units))) > 0:
                    return JsonResponse({"error": "Não te podes inscrever a disciplinas em que já tens uma inscrição!"}, status=400)

                db_enrollment = CourseUnitEnrollmentOptions(
                    course_unit_id=enrollment_metadata["course_unit_id"],
                    course_unit_enrollment=course_unit_enrollment,
                    enrolling=enrollment_metadata["enrolling"],
                    date=timezone.now()
                )
                models_to_save.append(db_enrollment)


            course_unit_enrollment.save()
            CourseUnitEnrollmentOptions.objects.bulk_create(models_to_save)

        return HttpResponse(status=200)
