from rest_framework.views import APIView
from django.http import HttpResponse, JsonResponse

from university.models import Course

from exchange.models import ExchangeAdminCourses

class AdminExchangeCoursesView(APIView):
    def get(self, request):
        user = request.user

        admin_exchange_courses = ExchangeAdminCourses.objects.filter(exchange_admin__username=user.username)
        courses = list(Course.objects.filter(id__in=admin_exchange_courses.values_list("course_id", flat=True)).values())

        return JsonResponse(courses, safe=False)
