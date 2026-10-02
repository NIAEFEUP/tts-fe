from exchange.models import DirectExchange, ExchangeUrgentRequests, CourseUnitEnrollments

class AdminExchangeStateChangeController:
    def update_state_to(self, request_type, id, state):
        if request_type == "direct_exchange":
            DirectExchange.objects.filter(id=id).update(admin_state=state)
        elif request_type == "urgent_exchange":
            ExchangeUrgentRequests.objects.filter(id=id).update(admin_state=state) 
        elif request_type == "enrollment":
            CourseUnitEnrollments.objects.filter(id=id).update(admin_state=state)
