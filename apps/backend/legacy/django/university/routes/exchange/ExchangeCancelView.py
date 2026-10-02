from django.http import JsonResponse
from django.views import View

from university.controllers.ExchangeValidationController import ExchangeValidationController

from exchange.models import DirectExchange, DirectExchangeParticipants, ExchangeAdmin, MarketplaceExchange

class ExchangeCancelView(View):
    def put(self, request, request_type, id):
        username = request.user.username
        is_admin = ExchangeAdmin.objects.filter(username=username).exists()

        if request_type == "direct":
            try:
                exchange = DirectExchange.objects.get(id=id)
            except DirectExchange.DoesNotExist:
                return JsonResponse({"error": "Exchange not found"}, status=404, safe=False)
            is_participant = DirectExchangeParticipants.objects.filter(
                direct_exchange=exchange, participant_nmec=username
            ).exists()
            if not is_admin and not is_participant:
                return JsonResponse({"error": "Sem permissões suficientes"}, status=403, safe=False)
            ExchangeValidationController().cancel_exchange(exchange)
            return JsonResponse({"success": True}, safe=False)

        elif request_type == "marketplace":
            try:
                exchange = MarketplaceExchange.objects.get(id=id)
            except MarketplaceExchange.DoesNotExist:
                return JsonResponse({"error": "Exchange not found"}, status=404, safe=False)
            if not is_admin and exchange.issuer_nmec != username:
                return JsonResponse({"error": "Sem permissões suficientes"}, status=403, safe=False)
            ExchangeValidationController().cancel_exchange(exchange)
            return JsonResponse({"success": True}, safe=False)

        return JsonResponse({"error": "Invalid request type"}, status=400, safe=False)
