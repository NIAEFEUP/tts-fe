import json
import jwt
import requests
import datetime

from django.core.paginator import Paginator

from django.http import HttpResponse, JsonResponse
from django.views import View

from university.controllers.AdminRequestFiltersController import AdminRequestFiltersController
from university.controllers.CourseUnitController import CourseUnitController 
from university.serializers.ExchangeUrgentRequestSerializer import ExchangeUrgentRequestSerializer

from exchange.models import ExchangeUrgentRequests, ExchangeAdmin

class ExchangeUrgentView(View):
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

        exchanges = ExchangeUrgentRequests.objects.all().order_by('date')

        for filter in AdminRequestFiltersController.filter_values():
            if request.GET.get(filter):
                exchanges = self.filter_actions[filter](exchanges, request.GET.get(filter))

        paginator = Paginator(exchanges, 10)
        page_number = request.GET.get("page")
        exchanges = [x for x in paginator.get_page(page_number if page_number != None else 1)]

        exchanges = ExchangeUrgentRequestSerializer(exchanges, many=True).data

        return JsonResponse({
            "exchanges": exchanges,
            "total_pages": paginator.num_pages
        }, safe=False)
        
    def put(self, request):
        current_user = request.user.username
        request_data = json.loads(request.body)
        urgent_request_id = request_data.get("urgent_request_id", None)
        if not urgent_request_id:
            return HttpResponse(status=400)
        urgent_request = ExchangeUrgentRequests.objects.filter(id=urgent_request_id).first()
        if not urgent_request:
            return HttpResponse(status=404)
        user_nmec = urgent_request.issuer_nmec
        if user_nmec != current_user:
            return HttpResponse(status=403)
        urgent_request.message = request_data.get("message", urgent_request.message)
        urgent_request.save()
        return JsonResponse(ExchangeUrgentRequestSerializer(urgent_request).data, safe=False, status=200)
        
