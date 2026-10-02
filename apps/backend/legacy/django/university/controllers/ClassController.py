from university.models import Class, Professor, Slot, SlotProfessor, SlotClass, CourseUnit
from django.db import transaction, IntegrityError
from university.controllers.SigarraController import SigarraController
from university.controllers.ScheduleController import ScheduleController
from django.forms.models import model_to_dict
from django.core.cache import cache

from tts_be.settings import CLASS_SCHEDULE_CACHE_TTL

import hashlib
import logging

from django.utils import timezone
from datetime import datetime

from django.db.models import Prefetch

logger = logging.getLogger(__name__)

class ClassController:
    @staticmethod
    def delete_cached_classes(course_unit_id: int):
        classes = Class.objects.filter(course_unit_id=course_unit_id)

        slot_ids = SlotClass.objects.filter(class_field__in=classes).values_list('slot_id', flat=True)
        slots = Slot.objects.filter(id__in=slot_ids)

        professor_ids = SlotProfessor.objects.filter(slot__in=slots).values_list('professor_id', flat=True)

        SlotClass.objects.filter(class_field__in=classes).delete()
        SlotProfessor.objects.filter(slot__in=slots).delete()

        slots.delete()
        classes.delete()

        Professor.objects.filter(id__in=professor_ids).delete()

    @staticmethod
    def remove_stale_slots(course_unit_id: int, fresh_slot_ids: set):
        # Sigarra is the source of truth: lessons that no longer appear in its
        # schedule for this course unit must be dropped, otherwise rescheduled
        # classes accumulate ghost slots from previous scrapes forever.
        stale_slot_classes = SlotClass.objects.filter(
            class_field__course_unit_id=course_unit_id
        ).exclude(slot_id__in=fresh_slot_ids)

        stale_slot_ids = list(stale_slot_classes.values_list('slot_id', flat=True))
        stale_slot_classes.delete()

        orphaned_slots = Slot.objects.filter(id__in=stale_slot_ids, slotclass__isnull=True)
        SlotProfessor.objects.filter(slot__in=orphaned_slots).delete()
        orphaned_slots.delete()

    @staticmethod
    def parse_classes_from_response_new_api(response_data: list):
        processed_slot_ids = set()
        schedule_controller = ScheduleController()

        if response_data is None:
            return processed_slot_ids

        for entry in response_data:
            lesson_id = entry.get('id')
            if lesson_id in processed_slot_ids:
                continue

            raw_day = entry.get('week_days', [None])[0]
            day = schedule_controller.day_from_sigarra_week_day(raw_day)

            if day is None or day < 0:
                continue

            start_str = entry.get('hour_start', '00:00:00')
            h, m, s = map(int, start_str.split(':'))
            start_time_decimal = h + (m / 60.0)

            end_str = entry.get('hour_end', '00:00:00')
            eh, em, es = map(int, end_str.split(':'))
            duration = (eh + em / 60.0) - start_time_decimal

            ucs = entry.get('ucs', [])
            primary_uc_sigarra_id = ucs[0].get('sigarra_id') if ucs else None

            typology = entry.get('typology', {})
            lesson_type = typology.get('acronym')

            slot, _ = Slot.objects.update_or_create(
                id=lesson_id,
                defaults={
                    'lesson_type': lesson_type,
                    'day': day,
                    'start_time': start_time_decimal,
                    'duration': duration,
                    'location': entry.get('rooms', [{}])[0].get('acronym'),
                    'is_composed': len(entry.get('classes', [])) > 1,
                    'last_updated': timezone.now()
                }
            )

            for turma in entry.get('classes', []):
                new_class, _ = Class.objects.update_or_create(
                    name=turma.get('acronym'),
                    course_unit_id=primary_uc_sigarra_id,
                    defaults={
                        'vacancies': 0,
                        'last_updated': timezone.now()
                    }
                )
                SlotClass.objects.update_or_create(slot=slot, class_field=new_class)

            for person in entry.get('persons', []):
                sigarra_id = person.get('sigarra_id')
                person_id = person.get('id')
                professor, _ = Professor.objects.update_or_create(
                    id=sigarra_id if sigarra_id else person_id,
                    defaults={
                        'professor_acronym': person.get('acronym'),
                        'professor_name': person.get('name')
                    }
                )

                if professor is None:
                    continue

                if not SlotProfessor.objects.filter(slot=slot).exists():
                    try:
                        with transaction.atomic():
                            SlotProfessor.objects.create(slot=slot, professor=professor)
                    except IntegrityError:
                        # slot_professor.slot_id is a OneToOneField (PK) in the current
                        # schema, so only one professor per slot is supported at the DB
                        # level. The exists() guard handles the common case; this catch
                        # covers the rare race-condition duplicate.
                        pass

            processed_slot_ids.add(lesson_id)

        return processed_slot_ids

    @staticmethod
    def parse_classes_from_response_old_api(response_data: list):
        fetched_classes = set()
        processed_slot_ids = set()
        schedule_controller = ScheduleController()

        for entry in response_data:
            course_unit_id = int(entry.get('ocorrencia_id'))
            start_time = float(entry.get('hora_inicio', 0)) / 3600.0
            duration = float(entry.get('aula_duracao', 0))
            location = entry.get('sala_sigla')
            lesson_type = entry.get('tipo')
            day = schedule_controller.from_sigarra_day(entry.get('dia'))

            hash = hashlib.sha256(f"{course_unit_id}{day}{start_time}{duration}{lesson_type}".encode('utf-8')).hexdigest()

            if hash in fetched_classes:
                # The slot is a duplicate by content but may have a different
                # aula_id; still register it so remove_stale_slots doesn't
                # treat it as stale.
                processed_slot_ids.add(entry.get('aula_id'))
                continue

            fetched_classes.add(hash)

            slot, _ = Slot.objects.update_or_create(
                id=entry.get('aula_id'),
                defaults={
                    'lesson_type': entry.get('tipo'),
                    'day': day,
                    'start_time': float(entry.get('hora_inicio', 0)) / 3600.0,
                    'duration': float(entry.get('aula_duracao', 0)),
                    'location': entry.get('sala_sigla'),
                    'is_composed': len(entry.get('turmas', [])) > 1,
                    'last_updated': timezone.now()
                }
            )

            for turma in entry.get('turmas', []):
                new_class, created = Class.objects.get_or_create(
                    name=turma.get('turma_sigla'),
                    course_unit_id=course_unit_id,
                    defaults={
                        'vacancies': 0,
                        'last_updated': timezone.now()
                    }
                )

                SlotClass.objects.get_or_create(
                    slot=slot,
                    class_field=new_class,
                )

            for docente in entry.get('docentes', []):
                professor, created = Professor.objects.get_or_create(
                    id=docente.get('doc_codigo'),
                    defaults={
                        'professor_acronym': entry.get('doc_sigla'),
                        'professor_name': docente.get('doc_nome')
                    }
                )

                if not SlotProfessor.objects.filter(slot=slot).exists():
                    try:
                        with transaction.atomic():
                            SlotProfessor.objects.create(slot=slot, professor=professor)
                    except IntegrityError:
                        # slot_professor.slot_id is a OneToOneField (PK) in the current
                        # schema, so only one professor per slot is supported at the DB
                        # level. The exists() guard handles the common case; this catch
                        # covers the rare race-condition duplicate.
                        pass

            processed_slot_ids.add(slot.id)

        return processed_slot_ids

    @staticmethod
    def get_professors(slot):
        slot_professors = SlotProfessor.objects.filter(slot_id=slot.id).select_related("professor")

        professors = [
            {
                'id': slot_professor.professor.id,
                'acronym': slot_professor.professor.professor_acronym,
                'name': slot_professor.professor.professor_name
            } for slot_professor in slot_professors
        ]

        return {
            'id': slot.id,
            'lesson_type': slot.lesson_type,
            'day': slot.day,
            'start_time': float(slot.start_time),
            'duration': float(slot.duration),
            'location': slot.location,
            'is_composed': slot.is_composed,
            'professors': professors
        }

    @staticmethod
    def _fetch_and_sync_schedule(course_unit: CourseUnit, new_schedule_api: bool):
        """Fetches the schedule from Sigarra and syncs it to the DB atomically.

        The HTTP call is made outside the transaction to avoid holding a DB
        connection open during a slow network request. The write transaction
        then upserts fresh slots and removes any that Sigarra no longer returns,
        keeping the DB in sync with the source of truth.

        Returns True on a successful sync, False otherwise.
        """
        schedule_response = SigarraController().get_course_schedule(
            course_unit.id,
            new_schedule_api=new_schedule_api,
            faculty=course_unit.course.faculty.acronym
        )

        if schedule_response.status_code != 200 or schedule_response.data is None:
            return False

        try:
            with transaction.atomic():
                if new_schedule_api:
                    fresh_slot_ids = ClassController.parse_classes_from_response_new_api(schedule_response.data)
                else:
                    fresh_slot_ids = ClassController.parse_classes_from_response_old_api(schedule_response.data)

                ClassController.remove_stale_slots(course_unit.id, fresh_slot_ids)

            return True
        except Exception:
            logger.exception("Failed to sync schedule for course unit %s", course_unit.id)
            return False

    @staticmethod
    def get_classes(course_unit_id: int, fetch_professors: bool = True, new_schedule_api: bool = True):
        try:
            course_unit = CourseUnit.objects.get(id=course_unit_id)
        except (CourseUnit.DoesNotExist, ValueError, TypeError):
            logger.warning("get_classes called with invalid course_unit_id=%r", course_unit_id)
            return []

        if not cache.get(f"schedule-{course_unit_id}"):
            synced = ClassController._fetch_and_sync_schedule(course_unit, new_schedule_api)

            # Only mark as fetched on success so failed lookups are retried
            # instead of serving empty data until the TTL expires.
            if synced:
                cache.set(f"schedule-{course_unit_id}", True, CLASS_SCHEDULE_CACHE_TTL)

        classes = Class.objects.filter(
            course_unit=course_unit_id
        ).select_related(
            'course_unit'
        ).prefetch_related(
            Prefetch('slotclass_set', queryset=SlotClass.objects.select_related('slot'))
        ).order_by("name")

        result = []

        for class_obj in classes:
            slot_list = []

            if fetch_professors:
                slot_list = [ClassController.get_professors(sc.slot) for sc in class_obj.slotclass_set.all()]
            else:
                slot_list = [
                    {
                        'id': sc.slot.id,
                        'lesson_type': sc.slot.lesson_type,
                        'day': sc.slot.day,
                        'start_time': float(sc.slot.start_time),
                        'duration': float(sc.slot.duration),
                        'location': sc.slot.location,
                        'is_composed': sc.slot.is_composed,
                        'professors': []
                    } for sc in class_obj.slotclass_set.all()
                ]

            result.append({
                "id": class_obj.id,
                "name": class_obj.name,
                "vacancies": class_obj.vacancies,
                "slots": slot_list
            })

        return result
