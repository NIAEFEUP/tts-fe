from django.http.response import JsonResponse
from rest_framework.views import APIView

from university.models import Course, CourseUnit
from university.serializers.StudentCourseMetadataSerializer import StudentCourseMetadataSerializer

from exchange.models import StudentCourseMetadata

class StudentCourseMetadataView(APIView):
    def get(self, request, nmec, course_id):
        course = Course.objects.get(pk=course_id)

        student_course_metadata = list(StudentCourseMetadata.objects.filter(
            nmec = f"{nmec}",
            course__id = course.id
        ).all())


        serialized_student_course_metadata = list(map(lambda metadata: StudentCourseMetadataSerializer(metadata).data, student_course_metadata))

        return JsonResponse(serialized_student_course_metadata, safe=False)
