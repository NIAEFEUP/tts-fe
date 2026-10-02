from django.http import HttpResponse 
from django.views import View

from university.controllers.AdminExchangeStateChangeController import AdminExchangeStateChangeController
from university.models import Class

from exchange.models import DirectExchange, DirectExchangeParticipants, ExchangeUrgentRequests, CourseUnitEnrollments, UserCourseUnits, ExchangeUrgentRequestOptions

class AdminExchangeRequestAcceptView(View):
    def put(self, request, request_type, id):
        AdminExchangeStateChangeController().update_state_to(request_type, id, "treated")

        if request_type == "direct_exchange":
            DirectExchange.objects.filter(id=id).update(accepted=True, canceled=False)
        
            direct_exchange_participants = DirectExchangeParticipants.objects.filter(direct_exchange_id=id)
            for participant in direct_exchange_participants:
                class_ = Class.objects.filter(name=participant.class_participant_goes_to, course_unit__id=participant.course_unit_id).first()
                UserCourseUnits.objects.filter(user_nmec=participant.participant_nmec, course_unit__id=participant.course_unit_id).update(class_field=class_)

        elif request_type == "urgent_exchange":
            ExchangeUrgentRequests.objects.filter(id=id).update(accepted=True)
            exchange_urgent_request = ExchangeUrgentRequests.objects.filter(id=id).first()

            exchange_urgent_request_options = ExchangeUrgentRequestOptions.objects.filter(exchange_urgent_request__id=id)
            for option in exchange_urgent_request_options:
                class_ = Class.objects.filter(name=option.class_issuer_goes_to, course_unit__id=option.course_unit.id).first()
                UserCourseUnits.objects.filter(user_nmec=exchange_urgent_request.user_nmec, course_unit__id=option.course_unit.id).update(class_field=class_)

        elif request_type == "enrollment":
            CourseUnitEnrollments.objects.filter(id=id).update(accepted=True)
        
        return HttpResponse(status=200)
