from datetime import date
from university.controllers.SigarraController import SigarraController
from university.models import CourseUnit, Professor
from exchange.models import MarketplaceExchange, MarketplaceExchangeClass, DirectExchange
from enum import Enum
import requests
import os

T_CLASS_CONFLICT = os.getenv('T_CLASS_CONFLICT', False)

class ExchangeStatus(Enum):
    FETCH_SCHEDULE_ERROR = 1
    STUDENTS_NOT_ENROLLED = 2
    CLASSES_OVERLAP = 3
    DUPLICATE_REQUEST = 4
    SUCCESS = 5

def exchange_status_message(status: ExchangeStatus):
    if status == ExchangeStatus.FETCH_SCHEDULE_ERROR:
        return "fetch-schedule-error"
    elif status == ExchangeStatus.STUDENTS_NOT_ENROLLED:
        return incorrect_class_error()
    elif status == ExchangeStatus.CLASSES_OVERLAP:
        return "classes-overlap"
    elif status == ExchangeStatus.DUPLICATE_REQUEST:
        return "duplicate-request"
    elif status == ExchangeStatus.SUCCESS:
        return "success"

def get_student_data(username, cookies):
    url = f"https://sigarra.up.pt/feup/pt/mob_fest_geral.perfil?pv_codigo={username}"
    response = requests.get(url, cookies=cookies)
    return response

def get_student_schedule_url(username, semana_ini, semana_fim):
    return f"https://sigarra.up.pt/feup/pt/hor_geral.estudantes_view?pv_num_unico={username}&pv_semana_ini={semana_ini}&pv_semana_fim={semana_fim}"

def create_marketplace_exchange_on_db(exchanges, curr_student):
    marketplace_exchange = MarketplaceExchange.objects.create(issuer=curr_student, accepted=False)
    for exchange in exchanges:
        course_unit = course_unit_by_id(exchange["course_unit_id"])
        MarketplaceExchangeClass.objects.create(marketplace_exchange=marketplace_exchange, course_unit_acronym=course_unit.acronym, course_unit_id=exchange["course_unit_id"], course_unit_name=exchange["course_unit"], old_class=exchange["old_class"], new_class=exchange["new_class"])


def build_marketplace_submission_schedule(schedule, submission, auth_student):
    for exchange in submission:
        course_unit = int(exchange["courseUnitId"])
        class_auth_student_goes_to = exchange["classNameRequesterGoesTo"]
        class_auth_student_goes_from = exchange["classNameRequesterGoesFrom"]

        auth_user_valid = (class_auth_student_goes_from, course_unit) in schedule[auth_student]
        if not(auth_user_valid):
            return (ExchangeStatus.STUDENTS_NOT_ENROLLED, None)

        class_schedule = SigarraController().get_class_schedule(schedule[auth_student][(class_auth_student_goes_from, course_unit)]["ocorrencia_id"], class_auth_student_goes_to).data
        class_schedule = list(filter(lambda x: x["tipo"] == "TP" or x["tipo"] == "PL" , class_schedule[0]))

        if len(class_schedule) > 0:
            schedule[auth_student][(class_auth_student_goes_to, course_unit)] = class_schedule[0]
            del schedule[auth_student][(class_auth_student_goes_from, course_unit)]

    return (ExchangeStatus.SUCCESS, None)

def get_unit_schedule_url(ocorrencia_id, semana_ini, semana_fim):
    return f"https://sigarra.up.pt/feup/pt/mob_hor_geral.ucurr?pv_ocorrencia_id={ocorrencia_id}&pv_semana_ini={semana_ini}&pv_semana_fim={semana_fim}"

"""
    Generates the new schedules the students will have after the exchange
    This is useful in order to apply the overlap validation logic in it and not in the current
    sigarra schedule of the users
"""
def build_new_schedules(student_schedules, exchanges, auth_username):
    for curr_exchange in exchanges:
        # There are 2 students involved in the exchange. THe other student is the student other than the currently authenticated user
        other_student = curr_exchange["other_student"]["mecNumber"]
        course_unit = CourseUnit.objects.get(pk=curr_exchange["courseUnitId"])
        course_unit = course_unit.id
        class_auth_student_goes_to = curr_exchange["classNameRequesterGoesTo"]
        class_other_student_goes_to = curr_exchange["classNameRequesterGoesFrom"] # The other student goes to its new class
        # If participant is neither enrolled in that course unit or in that class
        other_student_valid = (class_auth_student_goes_to, course_unit) in student_schedules[other_student]
        auth_user_valid = (class_other_student_goes_to, course_unit) in student_schedules[auth_username]

        if not(other_student_valid) or not(auth_user_valid):
            return (ExchangeStatus.STUDENTS_NOT_ENROLLED, None)

        user_uc = (class_auth_student_goes_to, course_unit)
        other_user_uc = (class_other_student_goes_to, course_unit)

        (student_schedules[auth_username][user_uc], student_schedules[other_student][other_user_uc]) = (student_schedules[other_student][user_uc], student_schedules[auth_username][other_user_uc])

        # Remove class the other student is going from and will not be in anymore
        del student_schedules[other_student][user_uc]

        # Remove class the auth student is going from and will not be in anymore
        del student_schedules[auth_username][other_user_uc]

    return (ExchangeStatus.SUCCESS, None)

def build_student_schedule_dicts(student_schedules, exchanges):
    for curr_exchange in exchanges:
        curr_username = curr_exchange["other_student"]["mecNumber"]
        if not curr_username in student_schedules.keys():
            sigarra_res = SigarraController().get_student_schedule(curr_username)
            if(sigarra_res.status_code != 200):
                return (ExchangeStatus.FETCH_SCHEDULE_ERROR, sigarra_res.status_code)

            schedule = sigarra_res.data

            student_schedules[curr_username] = build_student_schedule_dict(schedule)

    return (ExchangeStatus.SUCCESS, None)

def build_student_schedule_dict(schedule: list):
    return {
        (class_schedule["turma_sigla"].split("+")[0], int(class_schedule["ocorrencia_id"])): class_schedule for class_schedule in schedule if (class_schedule["tipo"] == "TP" or class_schedule["tipo"] == "PL")
    }

def check_class_schedule_overlap(day_1: int, start_1: int, end_1: int, day_2: int, start_2: int, end_2: int) -> bool:
    return day_1 == day_2 and start_1 < end_2 and start_2 < end_1

def check_class_mandatory(class_type) -> bool:
    return (T_CLASS_CONFLICT or class_type != 'T') and class_type != 'O'

def exchange_overlap(student_schedules, username) -> bool:
    for (key, class_schedule) in student_schedules[username].items():
        for (other_key, other_class_schedule) in student_schedules[username].items():
            if key == other_key:
                continue

            (class_schedule_day, class_schedule_start, class_schedule_end, class_schedule_type) = (class_schedule["dia"], class_schedule["hora_inicio"] / 3600, class_schedule["aula_duracao"] + class_schedule["hora_inicio"] / 3600, class_schedule['tipo'])
            (overlap_param_day, overlap_param_start, overlap_param_end, overlap_param_type) = (other_class_schedule["dia"], other_class_schedule["hora_inicio"] / 3600, other_class_schedule["aula_duracao"] + other_class_schedule["hora_inicio"] / 3600, other_class_schedule['tipo'])

            if (check_class_mandatory(class_schedule_type) and check_class_mandatory(overlap_param_type)
                and check_class_schedule_overlap(class_schedule_day, class_schedule_start, class_schedule_end, overlap_param_day, overlap_param_start, overlap_param_end)):
                return True

    return False

"""
    Returns name of course unit given its id
"""
def course_unit_name(course_unit_id):
    course_unit = CourseUnit.objects.get(id=course_unit_id)
    return course_unit.name

"""
    Returns the course unit given its acronym
"""
def course_unit_by_id(id):
    course_units = CourseUnit.objects.filter(id=id)
    return course_units.first()

def curr_semester_weeks():
    currdate = date.today()
    year = str(currdate.year)
    primeiro_semestre = currdate.month >= 9 and currdate.month <= 12
    if primeiro_semestre:
        semana_ini = "1001"
        semana_fim = "1201"
    else:
        semana_ini = "0101"
        semana_fim = "0601"
    return (year+semana_ini, year+semana_fim)

def incorrect_class_error() -> str:
    return "students-with-incorrect-classes"

def append_tts_info_to_sigarra_schedule(schedule):
    course_unit = CourseUnit.objects.filter(id=schedule['ocorrencia_id'])[0]

    schedule['url'] = course_unit.url
    # The sigarra api does not return the course with the full name, just the acronym
    schedule['ucurr_nome'] = course_unit_name(schedule['ocorrencia_id'])

def convert_sigarra_schedule(schedule_data):
    new_schedule_data = []

    for schedule in schedule_data:
        course_unit = CourseUnit.objects.filter(id=schedule['ocorrencia_id'])[0]
        professors = []
        for docente in schedule['docentes']:
            professor = Professor.objects.filter(id=docente['doc_codigo'])
            if(len(professor) < 1):
                continue
            professors.append({"name": docente['doc_nome'], "acronym": professor[0].professor_acronym})

        new_schedule = {
            'courseInfo': {
                'id': schedule['ocorrencia_id'],
                'course_unit_id': schedule['ocorrencia_id'],
                'acronym': course_unit.acronym,
                'name': course_unit.name,
                'url': course_unit.url
            },
            'classInfo': {
                'id': schedule['ocorrencia_id'],
                'name': schedule['turma_sigla'],
                'filteredTeachers': [],
                'slots': [{
                    'id': schedule['ocorrencia_id'],
                    'lesson_type': schedule["tipo"],
                    'day': schedule['dia'] - 2,
                    'start_time': schedule['hora_inicio'] / 3600,
                    'duration': schedule['aula_duracao'],
                    'location': schedule['sala_sigla'],
                    'professors_link': '',
                    'professors': professors
                }],
            }
        }

        new_schedule_data.append(new_schedule)

    return new_schedule_data
