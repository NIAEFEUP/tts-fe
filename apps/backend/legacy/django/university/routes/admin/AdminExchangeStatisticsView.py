from rest_framework.views import APIView
from django.http import JsonResponse


from exchange.models import DirectExchange
from exchange.models import MarketplaceExchange
from exchange.models import ExchangeUrgentRequests

class AdminExchangeStatisticsView(APIView):
    def get(self, request):

        direct_exchanges = DirectExchange.objects.all()
        marketplace_exchanges = MarketplaceExchange.objects.all()
        urgent_requests = ExchangeUrgentRequests.objects.all()

        total_requests = direct_exchanges.count() + marketplace_exchanges.count() + urgent_requests.count()

        accepted_count = (
            direct_exchanges.filter(admin_state='treated').count() +
            marketplace_exchanges.filter(admin_state='treated').count() +
            urgent_requests.filter(admin_state='treated').count()
        )

        rejected_count = (
            direct_exchanges.filter(admin_state='rejected').count() +
            marketplace_exchanges.filter(admin_state='rejected').count() +
            urgent_requests.filter(admin_state='rejected').count()
        )

        pending_count = (
            direct_exchanges.filter(admin_state='untreated').count() +
            marketplace_exchanges.filter(admin_state='untreated').count() +
            urgent_requests.filter(admin_state='untreated').count()
        )

        statistics = {
            'total_exchanges': total_requests,
            'accepted_exchanges': accepted_count,
            'rejected_exchanges': rejected_count,
            'pending_exchanges': pending_count,
        }

        return JsonResponse(statistics, safe=False)