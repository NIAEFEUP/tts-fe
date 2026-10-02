from rest_framework.views import APIView
from django.http import HttpResponse, JsonResponse

from university.models import CourseUnit

from exchange.models import ExchangeAdminCourseUnits

class AdminExchangeCourseUnitsView(APIView):
    def get(self, request):
        user = request.user

        admin_exchange_course_units = ExchangeAdminCourseUnits.objects.filter(exchange_admin__username=user.username)
        course_units = list(CourseUnit.objects.filter(id__in=admin_exchange_course_units.values_list("course_unit_id", flat=True)).values())

        return JsonResponse(course_units, safe=False)
