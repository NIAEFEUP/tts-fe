from django.http import HttpResponse
from django.views import View

from university.controllers.AdminExchangeStateChangeController import AdminExchangeStateChangeController
from university.models import Class

from exchange.models import DirectExchange, DirectExchangeParticipants, ExchangeUrgentRequests, CourseUnitEnrollments, UserCourseUnits

class AdminExchangeRequestRejectView(View):
    def put(self, request, request_type, id):
        AdminExchangeStateChangeController().update_state_to(request_type, id, "rejected")

        if request_type == "direct_exchange":
            # We only need to revert made changes here because the direct exchange is the only type of exchange that updates user schedule automatically
            DirectExchange.objects.filter(id=id).update(canceled=True)

            direct_exchange_participants = DirectExchangeParticipants.objects.filter(direct_exchange_id=id)
            for participant in direct_exchange_participants:
                class_ = Class.objects.filter(name=participant.class_participant_goes_from, course_unit__id=participant.course_unit_id).first()
                UserCourseUnits.objects.filter(user_nmec=participant.participant_nmec, course_unit__id=participant.course_unit_id).update(class_field=class_)

        elif request_type == "urgent_exchange":
                ExchangeUrgentRequests.objects.filter(id=id).update(accepted=False)
        elif request_type == "enrollment":
                CourseUnitEnrollments.objects.filter(id=id).update(accepted=False)
        
        return HttpResponse(status=200)
