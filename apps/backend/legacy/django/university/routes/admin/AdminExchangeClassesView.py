from rest_framework.views import APIView
from django.http import JsonResponse

from university.models import Class, CourseUnit, Course

from university.controllers.ClassController import ClassController

from exchange.models import ExchangeAdminCourseUnits, ExchangeAdminCourses

class AdminExchangeClassesView(APIView):
  def get(self, request):
    user = request.user

    admin_exchange_course_units = ExchangeAdminCourseUnits.objects.filter(exchange_admin__username=user.username)
    admin_exchange_courses = ExchangeAdminCourses.objects.filter(exchange_admin__username=user.username)
    course_units = list(CourseUnit.objects.filter(id__in=admin_exchange_course_units.values_list("course_unit_id", flat=True)).values('id', 'name', 'acronym', 'course_id'))
    course_units_from_courses = list(CourseUnit.objects.filter(course_id__in=admin_exchange_courses.values_list("course_id", flat=True)).values('id', 'name', 'acronym', 'course_id'))
    course_units.extend(course_units_from_courses)
    course_ids = set(cu['course_id'] for cu in course_units)
    courses = {course.id: course.acronym for course in Course.objects.filter(id__in=course_ids)}
    
    classes = []
    for course_unit in course_units:
      course_unit_classes = ClassController.get_classes(course_unit["id"])
      for class_item in course_unit_classes:
        class_item["course_unit_id"] = course_unit["id"]
        class_item["course_unit_acronym"] = course_unit["acronym"]
        class_item["course_id"] = course_unit["course_id"]
        class_item["course_acronym"] = courses.get(course_unit["course_id"])
      classes.extend(course_unit_classes)
    return JsonResponse(classes, safe=False)
