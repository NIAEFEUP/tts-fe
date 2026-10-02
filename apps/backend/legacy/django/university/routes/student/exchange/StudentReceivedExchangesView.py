from django.core.paginator import Paginator
from django.http.response import JsonResponse
from rest_framework.views import APIView
from django.db.models import Prefetch

from university.controllers.ExchangeController import DirectExchangePendingMotive
from university.serializers.DirectExchangeParticipantsSerializer import DirectExchangeParticipantsSerializer
from university.serializers.DirectExchangeSerializer import DirectExchangeSerializer

from exchange.models import DirectExchange, DirectExchangeParticipants

class StudentReceivedExchangesView(APIView):
    def get(self, request):
        exchange_participants = DirectExchangeParticipants.objects.filter(
            participant_nmec=request.user.username
        )

        exchanges = DirectExchange.objects.filter(
            id__in=exchange_participants.values_list("direct_exchange", flat=True).distinct()
        )

        return JsonResponse(self.build_pagination_payload(request, exchanges), safe=False)

    def build_pagination_payload(self, request, exchanges):
        page_number = request.GET.get("page")
        paginator = Paginator(exchanges, 10)
        page_obj = paginator.get_page(page_number if page_number != None else 1)

        return {
            "page": {
                "current": page_obj.number,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
            },
            "data": [
                {
                    **DirectExchangeSerializer(exchange).data,
                    "pending_motive": DirectExchangePendingMotive.get_value(DirectExchangePendingMotive.get_pending_motive(request.user.username, exchange)),
                }
            for exchange in page_obj]
        }

        
