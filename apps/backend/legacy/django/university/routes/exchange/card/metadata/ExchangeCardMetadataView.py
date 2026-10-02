import requests

from rest_framework.views import APIView
from django.http import HttpResponse, JsonResponse

from university.serializers.ClassSerializer import ClassSerializer

from university.controllers.StudentController import StudentController
from university.controllers.ClassController import ClassController
from university.controllers.SigarraController import SigarraController

class ExchangeCardMetadataView(APIView):
    def get(self, request, course_unit_id):
        """
            Returns the classes and students of a course unit
        """
        try:
            sigarra_res = SigarraController().get_course_unit_classes(course_unit_id)
            if (sigarra_res.status_code != 200):
                return HttpResponse(status=sigarra_res.status_code)

            students = sigarra_res.data

            new_response = JsonResponse({
                "classes": list(ClassController.get_classes(course_unit_id, new_schedule_api=True)),
                "students": [
                    {
                        "mecNumber": student.get("codigo"),
                        "name": student.get("nome"),
                        "classInfo": 
                            ClassSerializer(StudentController.student_class(student.get("codigo"), course_unit_id)).data 
                            if ClassSerializer(StudentController.student_class(student.get("codigo"), course_unit_id)).data.get("name") != ""
                            else None
                    } for student in students
                ]
            }, safe=False)

            new_response.status_code = sigarra_res.status_code

            return new_response

        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": e}, safe=False)
