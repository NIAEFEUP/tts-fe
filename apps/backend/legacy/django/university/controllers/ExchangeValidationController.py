from dataclasses import dataclass
from typing import Any, Dict, List, Tuple
from copy import deepcopy

from university.controllers.StudentScheduleController import StudentScheduleMetadata
from university.controllers.ExchangeController import ExchangeController
from university.controllers.SigarraController import SigarraController

from university.exchange.utils import build_student_schedule_dict, ExchangeStatus, exchange_status_message

from exchange.models import DirectExchangeParticipants, DirectExchange

from django.db import transaction
from django.utils import timezone  # Parece faltar esta importação

@dataclass
class ExchangeValidationMetadata:
    student_schedules: Dict[str, Any]
    target_class_schedules: Dict[Tuple[int, str], Any]

    def __init__(self):
        self.student_schedules = {}
        self.target_class_schedules = {}

class ExchangeValidationResponse:
    def __init__(self, status: bool, message: ExchangeStatus):
        self.status = status
        self.message = exchange_status_message(message)

class ExchangeValidationController:
    """
        Imagine the scenario where a person has two active pending exchanges:

        - 1LEIC01 -> 1LEIC06 (AM I)
        - 1LEIC01 -> 1LEIC09 (AM I)

        If the user accepts the first exchange and the exchange is accepted, the other exchange will be invalidated and users should be warned about that.


        All of the exchanges that include classes that were changed by the accepted exchange need to be revalidated or even canceled.
    """
    def cancel_conflicting_exchanges(self, accepted_exchange_id: int, metadata: StudentScheduleMetadata | None = None) -> None:
        if(DirectExchange.objects.filter(id=accepted_exchange_id).first().canceled):
            return

        conflicting_exchanges = []

        with transaction.atomic():
            accepted_exchange_participants = DirectExchangeParticipants.objects.filter(direct_exchange__id=accepted_exchange_id)
            for participant in accepted_exchange_participants:
                # 1. Are there any pending exchanges that include classes that a participant changed from?
                conflicting = DirectExchangeParticipants.objects.exclude(direct_exchange__id=accepted_exchange_id).filter(
                    participant_nmec=participant.participant_nmec,
                    class_participant_goes_from=participant.class_participant_goes_from,
                    course_unit_id=participant.course_unit_id,
                    direct_exchange__accepted=False,
                    direct_exchange__canceled=False
                )
                conflicting_exchanges.extend(list(map(lambda conflicting_exchange: conflicting_exchange.direct_exchange, conflicting)))

            # 2. Revalidate all of the other pending exchanges who include classes from the participant but not classes
            # that are the "class_participant_goes_from" of the exchange
            for participant in accepted_exchange_participants:
                exchanges = DirectExchange.objects.exclude(id=accepted_exchange_id).filter(
                    directexchangeparticipants__participant_nmec=participant.participant_nmec,
                    accepted=False,
                    canceled=False
                )
                exchanges = [exchange for exchange in exchanges if exchange not in conflicting_exchanges]

                for exchange in exchanges:
                    if not self.validate_direct_exchange(exchange.id, metadata=metadata).status:
                        conflicting_exchanges.append(exchange)

            # 3. Cancel all the conflicting exchanges
            for conflicting_exchange in conflicting_exchanges:
                self.cancel_exchange(conflicting_exchange)

    def cancel_exchange(self, exchange):
        exchange.canceled = True
        exchange.accepted = False
        exchange.save()

    def fetch_conflicting_exchanges_metadata(
        self, accepted_exchange_id: int,
        metadata: StudentScheduleMetadata
    ) -> None:
        # Just like in the normal cancel_conflicting_exchanges, we do not need to fetch metadata if the exchange is canceled
        if (DirectExchange.objects.filter(id=accepted_exchange_id).first().canceled):
            return

        exchange_participants = DirectExchangeParticipants.objects.filter(direct_exchange__id=accepted_exchange_id)
        for participant in exchange_participants:
            exchanges = DirectExchange.objects.exclude(id=accepted_exchange_id).filter(
                directexchangeparticipants__participant_nmec=participant.participant_nmec
            )
            for exchange in exchanges:
                self.fetch_direct_exchange_metadata(exchange.id, metadata)

    """
        This class will contain methods to validate the direct exchanges that are already inside
        of the database.

        The validation inside the views of the marketplace exchange and direct exchange have
        a different logic of working because they cannot use what is inside of the database and
        will validate the request format.
    """
    def validate_direct_exchange(self, exchange_id: int, metadata: StudentScheduleMetadata | None = None) -> ExchangeValidationResponse:
        exchange_participants = DirectExchangeParticipants.objects.filter(direct_exchange__id=exchange_id).all()

        # 1. Build new schedule of each student
        schedule = {}
        for participant in exchange_participants:
            if participant.participant_nmec not in schedule.keys():
                if metadata is not None:
                    new_schedule = deepcopy(metadata.student_schedule[participant.participant_nmec])
                else:
                    new_schedule = SigarraController().get_student_schedule(int(participant.participant_nmec)).data

                ExchangeController.update_schedule_accepted_exchanges(participant.participant_nmec, new_schedule)
                schedule[participant.participant_nmec] = build_student_schedule_dict(new_schedule)

        # 2. Check if users are inside classes they will exchange from with
        for username in schedule.keys():
            participant_entries = list(exchange_participants.filter(participant_nmec=username))

            for entry in participant_entries:
                if (entry.class_participant_goes_from, int(entry.course_unit_id)) not in list(schedule[username].keys()):
                    return ExchangeValidationResponse(False, ExchangeStatus.STUDENTS_NOT_ENROLLED)

                # 3. Alter the schedule of the users according to the exchange metadata
                if metadata is not None:
                    class_schedule = metadata.class_schedule[(int(entry.course_unit_id), entry.class_participant_goes_to)][0][0]
                else:
                    class_schedule = SigarraController().get_class_schedule(int(entry.course_unit_id), entry.class_participant_goes_to).data[0][0] # For other courses we will need to have pratical class as a list in the dictionary

                schedule[username][(entry.class_participant_goes_to, int(entry.course_unit_id))] = class_schedule
                del schedule[username][(entry.class_participant_goes_from, int(entry.course_unit_id))]

        # 4. Verify if the exchanges will have overlaps after building the new schedules
        for username in schedule.keys():
            if ExchangeController.exchange_overlap(schedule, username):
                return ExchangeValidationResponse(False, ExchangeStatus.CLASSES_OVERLAP)
            
        exchange = DirectExchange.objects.get(id=exchange_id)
        exchange.last_validated = timezone.now()
        exchange.save()

        return ExchangeValidationResponse(True, ExchangeStatus.SUCCESS)

    def fetch_direct_exchange_metadata(self, exchange_id: int, metadata: StudentScheduleMetadata) -> None:
        exchange_participants = DirectExchangeParticipants.objects.filter(direct_exchange__id=exchange_id).all()

        student_schedules = metadata.student_schedule
        for participant in exchange_participants:
            if participant.participant_nmec not in student_schedules:
                data = SigarraController().get_student_schedule(int(participant.participant_nmec)).data
                student_schedules[participant.participant_nmec] = data

        class_schedules = metadata.class_schedule
        for participant in exchange_participants:
            participant_nmec = participant.participant_nmec
            participant_entries = filter(lambda entry: entry.participant_nmec == participant_nmec, exchange_participants)

            for entry in participant_entries:
                key = (int(entry.course_unit_id), entry.class_participant_goes_to)
                if key not in class_schedules:
                    data = SigarraController().get_class_schedule(
                        int(entry.course_unit_id), entry.class_participant_goes_to
                    ).data
                    class_schedules[key] = data