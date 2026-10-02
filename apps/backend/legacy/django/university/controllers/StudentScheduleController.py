from dataclasses import dataclass
from typing import Any, Dict, Tuple
from django.http.response import HttpResponse

from university.controllers.ExchangeController import ExchangeController
from university.controllers.ClassController import ClassController
from university.controllers.SigarraController import SigarraController

from university.exchange.utils import convert_sigarra_schedule

from exchange.models import UserCourseUnits, DirectExchangeParticipants

import json
import hashlib

@dataclass
class StudentScheduleMetadata:
    student_schedule: Dict[str, Any]
    class_schedule: Dict[Tuple[int, str], Any]

    def __init__(self):
        self.student_schedule = {}
        self.class_schedule = {}

class StudentScheduleController:
    @staticmethod
    def get_user_schedule(nmec, fetch_from_sigarra=False):
        student_course_units = list(UserCourseUnits.objects.filter(user_nmec=nmec))

        if len(student_course_units) == 0 or fetch_from_sigarra:
            return StudentScheduleController.fetch_from_sigarra(nmec)
        else:
            return StudentScheduleController.fetch_from_db(nmec)

    @staticmethod
    def fetch_student_schedule_metadata(sigarra_controller: SigarraController, metadata: StudentScheduleMetadata, nmec: str):
        if nmec not in metadata.student_schedule:
            res = sigarra_controller.get_student_schedule(int(nmec))
            if res.status_code != 200:
                return HttpResponse(status=res.status_code)

            metadata.student_schedule[nmec] = res.data

        exchanges = DirectExchangeParticipants.objects.filter(participant_nmec=nmec, accepted=True, direct_exchange__canceled=False)
        for exchange in exchanges:
            res = sigarra_controller.get_class_schedule(int(exchange.course_unit_id), exchange.class_participant_goes_to)
            if res.status_code != 200:
                return HttpResponse(status=res.status_code)

            metadata.class_schedule[(int(exchange.course_unit_id), exchange.class_participant_goes_to)] = res.data

    @staticmethod
    def retrieve_course_unit_classes(sigarra_controller: SigarraController, username: str, metadata: StudentScheduleMetadata | None = None, update_exchanges: bool = False):
        if metadata is not None:
            schedule_data = metadata.student_schedule[username]
        else:
            sigarra_res = sigarra_controller.get_student_schedule(username)

            if sigarra_res.status_code != 200:
                return HttpResponse(status=sigarra_res.status_code)

            schedule_data = sigarra_res.data

        if update_exchanges:
            ExchangeController.update_schedule_accepted_exchanges(username, schedule_data, metadata=metadata)

        ids = set()
        course_unit_classes = set()
        for scheduleItem in schedule_data:
            if scheduleItem["tipo"] != "T" and scheduleItem["tipo"] != 'O':
                if int(scheduleItem["ocorrencia_id"]) in ids:
                    continue
                else:
                    course_unit_classes.add((scheduleItem["ocorrencia_id"], scheduleItem["turma_sigla"]))
                    ids.add(int(scheduleItem["ocorrencia_id"]))

        return course_unit_classes

    @staticmethod
    def fetch_from_db(username):
        course_units = UserCourseUnits.objects.filter(user_nmec = username)
        class_ids = list(map(lambda course_unit: course_unit.class_field.id, course_units))

        schedule = []
        for course_unit in course_units:
            classes = ClassController.get_classes(course_unit.course_unit.id, new_schedule_api=True)
            classes = list(filter(lambda class_: class_["id"] in class_ids, classes))

            if course_unit.course_unit.id == 548052:
                sigarra_schedule = SigarraController().get_student_schedule(username).data
                schedule.extend(convert_sigarra_schedule([list(filter(lambda schedule: schedule["ocorrencia_id"] == 548052, sigarra_schedule))[0]]))
                continue

            for class_ in classes:
                for slot in class_["slots"]:
                    schedule.append({
                        "courseInfo": {
                            'id': course_unit.course_unit.id,
                            'course_unit_id': course_unit.course_unit.id,
                            'acronym': course_unit.course_unit.acronym,
                            'name': course_unit.course_unit.name,
                            'url': course_unit.course_unit.url
                        },
                        "classInfo": {
                            'id': class_["id"],
                            'name': class_["name"],
                            'filteredTeachers': [],
                            'slots': [slot]
                        }
                    })

        return (schedule, len(DirectExchangeParticipants.objects.filter(
                    participant_nmec=username,
                    direct_exchange__accepted=True
                )) == 0)

    @staticmethod
    def fetch_from_sigarra(username):
        sigarra_res = SigarraController().get_student_schedule(username)

        if sigarra_res.status_code != 200:
            return HttpResponse(status=sigarra_res.status_code)

        schedule_data = sigarra_res.data

        old_schedule = hashlib.sha256(json.dumps(schedule_data, sort_keys=True).encode()).hexdigest()

        ExchangeController.update_schedule_accepted_exchanges(username, schedule_data)

        new_schedule = hashlib.sha256(json.dumps(schedule_data, sort_keys=True).encode()).hexdigest()

        sigarra_synchronized = old_schedule == new_schedule

        converted_schedule = convert_sigarra_schedule(schedule_data)
        for item in converted_schedule:
            item["classInfo"]["name"] = item["classInfo"]["name"].split("+")[0]

        return (converted_schedule, sigarra_synchronized)
