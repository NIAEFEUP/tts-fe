import base64
import json

from django.core.paginator import Paginator
from university.controllers.ClassController import ClassController
from university.controllers.SigarraController import SigarraController
from university.exchange.utils import ExchangeStatus, check_class_mandatory, check_class_schedule_overlap, course_unit_by_id
from exchange.models import DirectExchange, DirectExchangeParticipants, ExchangeExpirations, ExchangeUrgentRequests, MarketplaceExchange, UserCourseUnits
from django.utils import timezone
from enum import Enum

from university.models import Class

from university.serializers.DirectExchangeParticipantsSerializer import DirectExchangeParticipantsSerializer
from university.serializers.ExchangeUrgentRequestSerializer import ExchangeUrgentRequestOptionsSerializer
from university.serializers.MarketplaceExchangeClassSerializer import MarketplaceExchangeClassSerializer

class ExchangeType(Enum):
    MARKETPLACE_EXCHANGE = 1
    DIRECT_EXCHANGE = 2
    URGENT_EXCHANGE = 3

    def toString(self):
        if self == ExchangeType.MARKETPLACE_EXCHANGE:
            return "marketplaceexchange"
        elif self == ExchangeType.DIRECT_EXCHANGE:
            return "directexchange"
        elif self == ExchangeType.URGENT_EXCHANGE:
            return "urgentexchange"
        return "unknownexchange"

class DirectExchangePendingMotive(Enum):
    USER_DID_NOT_ACCEPT = 1
    OTHERS_DID_NOT_ACCEPT = 2
    NOT_PENDING = 3

    @staticmethod
    def get_pending_motive(curr_user_nmec: str, direct_exchange: DirectExchange):
        participants = list(DirectExchangeParticipants.objects.filter(
            participant_nmec=curr_user_nmec, direct_exchange=direct_exchange).all()
        )

        # The participants list includes the options in the exchange of the current user
        for participant in participants:
            if not participant.accepted:
                return DirectExchangePendingMotive.USER_DID_NOT_ACCEPT

        if not direct_exchange.accepted:
            return DirectExchangePendingMotive.OTHERS_DID_NOT_ACCEPT

        return DirectExchangePendingMotive.NOT_PENDING

    @staticmethod
    def get_value(pending_motive):
        return pending_motive.value

class ExchangeController:
    @staticmethod
    def is_exchange_period_open_for_course_unit(course_unit_id: int) -> bool:
        now = timezone.now()
        return ExchangeExpirations.objects.filter(
            course_unit_id=course_unit_id,
            active_date__lte=now,
            end_date__gte=now,
        ).exists()
    
    @staticmethod
    def eligible_course_units(nmec):
        course_units = UserCourseUnits.objects.filter(user_nmec=nmec).values_list("course_unit_id", flat=True)

        exchange_expirations = ExchangeExpirations.objects.filter(
            course_unit_id__in=course_units,
            active_date__lte=timezone.now(),
            end_date__gte=timezone.now(),
        ).values_list("course_unit_id", flat=True)

        return list(exchange_expirations)

    @staticmethod
    def getExchangeType(exchange) -> ExchangeType:
        if type(exchange) == MarketplaceExchange:
            return ExchangeType.MARKETPLACE_EXCHANGE
        elif type(exchange) == DirectExchange:
            return ExchangeType.DIRECT_EXCHANGE
        elif type(exchange) == ExchangeUrgentRequests:
            return ExchangeType.URGENT_EXCHANGE

    @staticmethod
    def getOptionsDependinOnExchangeType(exchange):
        if type(exchange) == MarketplaceExchange:
            return [MarketplaceExchangeClassSerializer(exchange_class).data for exchange_class in exchange.options]
        elif type(exchange) == DirectExchange:
            return [DirectExchangeParticipantsSerializer(participant).data for participant in exchange.options]
        elif type(exchange) == ExchangeUrgentRequests:
            return [ExchangeUrgentRequestOptionsSerializer(option).data for option in exchange.options]

    @staticmethod
    def getExchangeOptionClasses(options):
        classes = sum(list(map(lambda option: ClassController.get_classes(option.course_unit_id, new_schedule_api=True), options)), [])
        return filter(lambda currentClass: any(currentClass["name"] == option.class_issuer_goes_from for option in options), classes)

    @staticmethod
    def courseUnitNameFilterInExchangeOptions(options, courseUnitNameFilter):
        matches = []
        for courseUnitId in courseUnitNameFilter:
            for option in options:
                if int(courseUnitId) == option.course_unit_id:
                    matches.append(1)

        return len(matches) == len(courseUnitNameFilter)

    @staticmethod
    def parseClassesFilter(classesFilter: str) -> dict:
        if not classesFilter:
            return {}

        b64_decoded = base64.b64decode(classesFilter)
        string = b64_decoded.decode('utf-8')
        return dict(json.loads(string))

    @staticmethod
    def getStudentClass(student_schedules, username, courseUnitId):
        schedule = student_schedules[username]
        for key in schedule.keys():
            if key[1] == int(courseUnitId):
                return key[0]

        return None

    @staticmethod
    def create_direct_exchange_participants(student_schedules, exchanges, inserted_exchanges, exchange_db_model, auth_user):
        for curr_exchange in exchanges:
            other_student = curr_exchange["other_student"]["mecNumber"]
            course_unit = course_unit_by_id(curr_exchange["courseUnitId"])

            inserted_exchanges.append(DirectExchangeParticipants(
                participant_name=curr_exchange["other_student"]["name"],
                participant_nmec=curr_exchange["other_student"]["mecNumber"],
                class_participant_goes_from=ExchangeController.getStudentClass(student_schedules, other_student, curr_exchange["courseUnitId"]),
                class_participant_goes_to=curr_exchange["classNameRequesterGoesFrom"],
                course_unit=course_unit.acronym,
                course_unit_id=curr_exchange["courseUnitId"],
                direct_exchange=exchange_db_model,
                accepted=False,
                date=timezone.now()
            ))

            inserted_exchanges.append(DirectExchangeParticipants(
                participant_name=f"{auth_user.first_name} {auth_user.last_name}",
                participant_nmec=auth_user.username,
                class_participant_goes_from=curr_exchange["classNameRequesterGoesFrom"], # This is not a typo, the old class of the authenticted student is the new class of the other student
                class_participant_goes_to=curr_exchange["classNameRequesterGoesTo"],
                course_unit=course_unit.acronym,
                course_unit_id=curr_exchange["courseUnitId"],
                direct_exchange=exchange_db_model,
                accepted=False,
                date=timezone.now()
            ))

        return (ExchangeStatus.SUCCESS, None)

    """
        Checks if schedule for a user with a given username has overlaps
    """
    @staticmethod
    def exchange_overlap(student_schedules, username) -> bool:

        for (key, class_schedule) in student_schedules[username].items():
            for (other_key, other_class_schedule) in student_schedules[username].items():
                if key == other_key:
                    continue

                if class_schedule["ucurr_sigla"] == other_class_schedule["ucurr_sigla"]:
                    continue

                (class_schedule_day, class_schedule_start, class_schedule_end, class_schedule_type) = (class_schedule["dia"], class_schedule["hora_inicio"] / 3600, class_schedule["aula_duracao"] + class_schedule["hora_inicio"] / 3600, class_schedule['tipo'])
                (overlap_param_day, overlap_param_start, overlap_param_end, overlap_param_type) = (other_class_schedule["dia"], other_class_schedule["hora_inicio"] / 3600, other_class_schedule["aula_duracao"] + other_class_schedule["hora_inicio"] / 3600, other_class_schedule['tipo'])

                class_changed = False
                other_class_changed = False

                # Obtain ids of classes before change in the new schedule
                original_class = UserCourseUnits.objects.filter(user_nmec=username, course_unit__id=int(class_schedule["ocorrencia_id"])).first()
                if original_class is not None:
                    original_class = original_class.class_field.id
                    new_class_id = Class.objects.filter(name=class_schedule["turma_sigla"].split("+")[0], course_unit_id=int(class_schedule["ocorrencia_id"])).first().id
                    class_changed = new_class_id != original_class

                original_other_class = UserCourseUnits.objects.filter(user_nmec=username, course_unit__id=int(other_class_schedule["ocorrencia_id"])).first()
                if original_other_class is not None:
                    original_other_class = original_other_class.class_field.id
                    # Need to check if the classes are the same as the previous ]ones or not
                    new_other_class_id = Class.objects.filter(name=other_class_schedule["turma_sigla"].split("+")[0], course_unit_id=int(other_class_schedule["ocorrencia_id"])).first().id
                    other_class_changed = new_other_class_id != original_other_class

                if (check_class_mandatory(class_schedule_type) and check_class_mandatory(overlap_param_type)
                    and check_class_schedule_overlap(class_schedule_day, class_schedule_start, class_schedule_end, overlap_param_day, overlap_param_start, overlap_param_end)):
                    if class_changed or other_class_changed:
                        return True

        return False

    @staticmethod
    def update_schedule_accepted_exchanges(student, schedule, metadata: 'StudentScheduleMetadata | None' = None):
        accepted_options = DirectExchangeParticipants.objects.filter(participant_nmec=student, accepted=True, direct_exchange__canceled=False, direct_exchange__accepted=True).order_by('direct_exchange__date')
        (status, trailing) = ExchangeController.update_schedule(schedule, accepted_options)
        if status == ExchangeStatus.FETCH_SCHEDULE_ERROR:
            return (ExchangeStatus.FETCH_SCHEDULE_ERROR, trailing)

        return (ExchangeStatus.SUCCESS, None)

    @staticmethod
    def update_schedule(student_schedule, exchanges, metadata: 'StudentScheduleMetadata | None' = None):
        for exchange in exchanges:
            for i, schedule in enumerate(student_schedule):
                ocurr_id = int(schedule["ocorrencia_id"])

                if ocurr_id == int(exchange.course_unit_id):
                    class_type = schedule["tipo"]

                    if metadata is not None:
                        res = metadata.class_schedule[(int(exchange.course_unit_id), exchange.class_participant_goes_to)]
                    else:
                        res = SigarraController().get_class_schedule(int(exchange.course_unit_id), exchange.class_participant_goes_to)
                        if res.status_code != 200:
                            return (ExchangeStatus.FETCH_SCHEDULE_ERROR, None)
                        (tp_schedule, t_schedule) = res.data

                    tp_schedule.extend(t_schedule)
                    new_schedules = tp_schedule

                    for new_schedule in new_schedules:
                        for turma in new_schedule["turmas"]:
                            if turma["turma_sigla"] == exchange.class_participant_goes_to and new_schedule["tipo"] == class_type:
                                student_schedule[i] = new_schedule

        return (ExchangeStatus.SUCCESS, None)
