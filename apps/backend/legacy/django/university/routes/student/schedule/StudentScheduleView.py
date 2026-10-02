from django.http.response import JsonResponse
import requests
from rest_framework.views import APIView

from exchange.models import StudentCourseMetadata, UserCourseUnits

from university.controllers.StudentController import StudentController
from university.controllers.StudentScheduleController import StudentScheduleController

class StudentScheduleView(APIView):
    def get(self, request, nmec=""):
        username = nmec if nmec != "" else request.user.username

        try:
            (schedule, sigarra_synchronized) = StudentScheduleController.get_user_schedule(username)

            if(nmec == ""):
                if len(StudentCourseMetadata.objects.filter(nmec = request.user.username)) == 0:
                    StudentController.populate_course_metadata(
                        request.user.username,
                    )

                if len(UserCourseUnits.objects.filter(user_nmec = request.user.username)) == 0:
                    StudentController.populate_user_course_unit_data(
                        request.user.username, 
                    ) 

            return JsonResponse({
                "schedule": schedule,
                "noChanges": sigarra_synchronized
            }, safe=False)
        
        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": e}, safe=False)

    def put(self ,request):
        StudentController.refresh_metadata(request.user.username)

        (schedule, sigarra_synchronized) = StudentScheduleController.get_user_schedule(request.user.username)
        
        return JsonResponse({
            "schedule": schedule,
            "noChanges": sigarra_synchronized
        }, safe=False)
