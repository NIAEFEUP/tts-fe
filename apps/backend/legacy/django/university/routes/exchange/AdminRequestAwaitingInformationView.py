from django.http import HttpResponse 
from django.views import View

from university.controllers.AdminExchangeStateChangeController import AdminExchangeStateChangeController

class AdminRequestAwaitingInformationView(View):
    def put(self, request, request_type, id):
        AdminExchangeStateChangeController().update_state_to(request_type, id, "awaiting-information")
    
        return HttpResponse(status=200)