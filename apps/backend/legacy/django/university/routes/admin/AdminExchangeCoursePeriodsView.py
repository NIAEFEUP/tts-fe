from rest_framework.views import APIView
from django.http import JsonResponse
from django.utils import timezone
from datetime import datetime
from django.db.models import Min

from university.models import Course
from exchange.models import ExchangeAdminCourses, ExchangeExpirations


class AdminExchangeCoursePeriodsView(APIView):
    def get(self, request):
        user = request.user

        admin_exchange_courses = ExchangeAdminCourses.objects.filter(exchange_admin__username=user.username)
        courses = Course.objects.filter(id__in=admin_exchange_courses.values_list("course_id", flat=True))

        response_data = []

        for course in courses:
            exchange_expirations = (
                ExchangeExpirations.objects
                .filter(course_unit__course__id=course.id, is_course_expiration=True)
                .values('active_date', 'end_date')
                .annotate(id=Min('id'))
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
                "courseId": course.id,
                "courseName": course.name,
                "courseAcronym": course.acronym,
                "exchangePeriods": exchange_periods
            })

        return JsonResponse({"courses": response_data}, safe=False)