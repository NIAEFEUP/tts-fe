from django.http import JsonResponse
from django.views import View
from django.core.exceptions import ObjectDoesNotExist

from university.controllers.ExchangeValidationController import ExchangeValidationController
from exchange.models import DirectExchange

class DirectExchangeValidationView(View):
    def get(self, request, id):
        try:
            exchange = DirectExchange.objects.get(id=id)
        except ObjectDoesNotExist:
            return JsonResponse({"valid": False, "error": "Exchange not found"}, status=404)

        controller = ExchangeValidationController()
        validation = controller.validate_direct_exchange(id)

        if validation.status:
            return JsonResponse({
                "valid": True,
                "last_validated": exchange.last_validated.isoformat() if exchange.last_validated else None
            }, status=200)

        controller.cancel_exchange(exchange)
        return JsonResponse({"valid": False, "error": validation.message}, status=400)
