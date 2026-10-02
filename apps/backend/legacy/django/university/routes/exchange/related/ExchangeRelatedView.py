from django.db.models import Q

from university.serializers.MarketplaceExchangeClassSerializer import MarketplaceExchangeSerializer, MarketplaceExchangeClassSerializer

from university.controllers.ExchangeController import ExchangeController

from django.db.models import Count
from django.http import JsonResponse
import json

from django.db.models import Prefetch



from django.http import HttpResponse 
from django.views import View

from university.controllers.AdminExchangeStateChangeController import AdminExchangeStateChangeController
from university.models import Class

from exchange.models import MarketplaceExchange

class ExchangeRelatedView(View):
    def post(self, request):

        exchanges = request.POST.getlist('exchangeChoices[]')
        exchanges = list(map(lambda exchange : json.loads(exchange), exchanges))

        q_objects = Q() 

        for exchange in exchanges:
            q_objects &= Q(
                marketplaceexchangeclass__class_issuer_goes_from=exchange['classNameRequesterGoesTo'],
                marketplaceexchangeclass__course_unit_id=exchange['courseUnitId'],
                marketplaceexchangeclass__class_issuer_goes_to=exchange['classNameRequesterGoesFrom']
            )

        matching_exchanges = MarketplaceExchange.objects.prefetch_related(
            Prefetch(
                'marketplaceexchangeclass_set',
                to_attr='options'
            )).annotate(
            total_classes=Count('marketplaceexchangeclass'),
            matching_classes=Count('marketplaceexchangeclass', filter=q_objects)
        ).filter(
            total_classes=len(exchanges),
            matching_classes=len(exchanges)
        ).exclude(Q(issuer_nmec=request.user.username) | Q(canceled=True) | Q(accepted=True)).distinct()

        exchanges = [{
                "id": exchange.id,
                "type": "marketplaceexchange",
                "issuer_name": exchange.issuer_name,
                "issuer_nmec": exchange.issuer_nmec,
                "options": [
                    MarketplaceExchangeClassSerializer(exchange_class).data for exchange_class in exchange.options
                ],
                "classes": list(ExchangeController.getExchangeOptionClasses(exchange.options)),
                "date":  exchange.date,
                "accepted": exchange.accepted
            } for exchange in matching_exchanges]

        return JsonResponse({ "exchanges": exchanges }, safe=False)
