from django.http.response import JsonResponse
from rest_framework.views import APIView

from university.controllers.ExchangeController import ExchangeController
from university.models import CourseUnit

class StudentEligibleCourseUnits(APIView):
    def get(self, request):
        eligible_course_units_ids = ExchangeController.eligible_course_units(
            request.user.username
        )

        request.session["eligible_course_units"] = list(eligible_course_units_ids)

        eligible_course_units = CourseUnit.objects.filter(id__in=eligible_course_units_ids).values()

        return JsonResponse(list(eligible_course_units), safe=False)

