import base64
import json
from django.core.paginator import Paginator
from django.db.models import Prefetch
from django.http.response import HttpResponse, JsonResponse
from rest_framework.views import APIView

from university.controllers.ClassController import ClassController
from university.controllers.ExchangeController import ExchangeController, ExchangeType
from university.controllers.SigarraController import SigarraController
from university.serializers.MarketplaceExchangeClassSerializer import MarketplaceExchangeClassSerializer

from exchange.models import DirectExchange, DirectExchangeParticipants, ExchangeUrgentRequestOptions, ExchangeUrgentRequests, MarketplaceExchange, MarketplaceExchangeClass

class StudentSentExchangesView(APIView):
    def get(self, request):
        course_unit_name_filter = request.query_params.get('courseUnitNameFilter', None)

        marketplace_exchanges = list(MarketplaceExchange.objects.prefetch_related(
            Prefetch(
                'marketplaceexchangeclass_set',
                queryset=MarketplaceExchangeClass.objects.all(),
                to_attr='options'
            )
        ).filter(issuer_nmec=request.user.username).all())

        direct_exchanges = list(DirectExchange.objects.prefetch_related(
            Prefetch(
                'directexchangeparticipants_set',
                queryset=DirectExchangeParticipants.objects.all(),
                to_attr='options'
            )
        ).filter(
            directexchangeparticipants__participant_nmec=request.user.username
        ).all())

        urgent_exchanges = list(ExchangeUrgentRequests.objects.prefetch_related(
            Prefetch(
                'exchangeurgentrequestoptions_set',
                queryset=ExchangeUrgentRequestOptions.objects.all(),
                to_attr='options'
            )
        ).filter(
            issuer_nmec=request.user.username
        ).all())

        # exchanges = marketplace_exchanges + direct_exchanges
        # exchanges = sorted(exchanges, key=lambda request: request.date)
        exchanges = marketplace_exchanges + urgent_exchanges

        if course_unit_name_filter:
            exchanges = list(filter(
                lambda x: ExchangeController.courseUnitNameFilterInExchangeOptions(x.options, course_unit_name_filter),
                exchanges
            ))

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
            "data": [{
                "id": exchange.id,
                "type": ExchangeController.getExchangeType(exchange).toString(),
                "issuer_name": exchange.issuer_name,
                "issuer_nmec": exchange.issuer_nmec,
                "accepted": exchange.accepted,
                "canceled": exchange.canceled,
                "options": ExchangeController.getOptionsDependinOnExchangeType(exchange),
                "date": exchange.date
            } if ExchangeController.getExchangeType(exchange) != ExchangeType.URGENT_EXCHANGE
                else {
                    "id": exchange.id,
                    "type": ExchangeController.getExchangeType(exchange).toString(),
                    "issuer_name": exchange.issuer_name, # The DB does not have this field, but it is fetched on the frontend
                    "issuer_nmec": exchange.issuer_nmec,
                    "accepted": exchange.accepted,
                    "message": exchange.message,
                    "options": ExchangeController.getOptionsDependinOnExchangeType(exchange),
                    "date": exchange.date
                }
            for exchange in page_obj]
        }
