from django.http import JsonResponse
from django.views import View
from django.utils import timezone
from django.http.response import HttpResponse
from django.shortcuts import redirect
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, csrf_exempt
import requests

from tts_be.settings import DEBUG

from university.controllers.ExchangeController import ExchangeController
from university.controllers.SigarraController import SigarraController

from exchange.models import ExchangeExpirations, ExchangeAdmin

class InfoView(View):
    def get(self, request):
        if request.user.is_authenticated:
            eligible_course_units = request.session.get("eligible_course_units")
            
            if not eligible_course_units:
                eligible_course_units = ExchangeController.eligible_course_units(
                    request.user.username
                )

            eligible_exchange = bool(eligible_course_units)

            is_admin = ExchangeAdmin.objects.filter(username=request.user.username).exists()

            return JsonResponse({
                "signed": True,
                "username": request.user.username,
                "name": f"{request.user.first_name} {request.user.last_name}",
                "eligible_exchange": True if bool(DEBUG) else eligible_exchange,
                "is_admin": is_admin,
            }, safe=False)
        else:
            return JsonResponse({
                "signed": False
            }, safe=False)
