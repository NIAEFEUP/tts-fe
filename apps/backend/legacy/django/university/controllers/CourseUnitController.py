from university.models import CourseMetadata

class CourseUnitController:
    available_courses = [22862, 22841]

    @staticmethod
    def course_unit_curricular_year(course_unit_id):
        course_metadata = CourseMetadata.objects.filter(
            course_unit_id=course_unit_id,
            course_id__in=CourseUnitController.available_courses
        ).first()
        

        return course_metadata.course_unit_year

    @staticmethod
    def course_unit_major(course_unit_id):
        course_metadata = CourseMetadata.objects.filter(
            course_id__in=CourseUnitController.available_courses,
            course_unit_id=course_unit_id).first()

        return course_metadata.course.id