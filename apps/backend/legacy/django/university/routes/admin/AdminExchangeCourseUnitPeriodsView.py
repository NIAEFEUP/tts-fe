from rest_framework.views import APIView
from django.http import JsonResponse

from university.models import CourseUnit
from exchange.models import ExchangeAdminCourseUnits, ExchangeExpirations


class AdminExchangeCourseUnitPeriodsView(APIView):
    def get(self, request):
        user = request.user

        admin_exchange_units = ExchangeAdminCourseUnits.objects.filter(
            exchange_admin__username=user.username
        )
        course_units = CourseUnit.objects.filter(
            id__in=admin_exchange_units.values_list("course_unit_id", flat=True)
        )

        response_data = []

        for unit in course_units:
            exchange_expirations = (
                ExchangeExpirations.objects
                .filter(course_unit__id=unit.id, is_course_expiration=False)
                .values('id','active_date', 'end_date')
                .distinct()
            )

            exchange_periods = []
            for expiration in exchange_expirations:
                try:
                    start_date = expiration['active_date'].strftime('%Y-%m-%dT%H:%M:%S.%fZ')
                    end_date = expiration['end_date'].strftime('%Y-%m-%dT%H:%M:%S.%fZ')
                    exchange_periods.append({
                        "id": expiration['id'],
                        "startDate": start_date,
                        "endDate": end_date
                    })
                except (ValueError, AttributeError) as e:
                    print(f"Malformed datetime found: {expiration}, error: {e}")
                    continue

            response_data.append({
                "id": unit.id,
                "name": unit.name,
                "acronym": unit.acronym,
                "exchangePeriods": exchange_periods
            })

        return JsonResponse({"courseUnits": response_data}, safe=False)