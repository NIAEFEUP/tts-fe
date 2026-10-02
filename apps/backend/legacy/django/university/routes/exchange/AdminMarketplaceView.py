from django.http import JsonResponse
from django.views import View

from django.core.paginator import Paginator

from django.db.models import Prefetch

from university.serializers.MarketplaceExchangeClassSerializer import MarketplaceExchangeClassSerializer

from exchange.models import MarketplaceExchange, DirectExchange

from university.controllers.ExchangeController import ExchangeController
from university.controllers.CourseUnitController import CourseUnitController
from university.controllers.AdminRequestFiltersController import AdminRequestFiltersController

class AdminMarketplaceView(View):
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
                lambda exchange: exchange.get("admin_state") in states,
                exchanges
            )
        )

    def get(self, request):
        exchanges = MarketplaceExchange.objects.prefetch_related(
                Prefetch(
                    'marketplaceexchangeclass_set',
                    to_attr='options'
                )).all()

        paginator = Paginator(exchanges, 10)
        page = request.GET.get('page')
        page_obj = paginator.get_page(page)

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
                "admin_state": exchange.admin_state,
                "accepted": exchange.accepted
            } for exchange in page_obj if not DirectExchange.objects.filter(marketplace_exchange=exchange).exists()]

        for filter in AdminRequestFiltersController.filter_values():
            if request.GET.get(filter):
                exchanges = self.filter_actions[filter](exchanges, request.GET.get(filter))

        return JsonResponse({
            "exchanges": exchanges,
            "total_pages": paginator.num_pages
        }, safe = False)
