from django.http import HttpResponse
from rest_framework.views import APIView

from university.controllers.SigarraController import SigarraController

class StudentPhotoView(APIView):
    def get(self, request, nmec):
        sigarra_controller = SigarraController()
        photo = sigarra_controller.retrieve_student_photo(nmec)

        return HttpResponse(photo.data, content_type="image/jpeg")
