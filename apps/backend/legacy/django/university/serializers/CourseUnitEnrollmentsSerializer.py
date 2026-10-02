from django.forms.models import model_to_dict
from rest_framework import serializers

from university.models import CourseUnit, Course
from exchange.models import CourseUnitEnrollmentOptions
from university.controllers.ClassController import ClassController
from university.controllers.SigarraController import SigarraController

class CourseUnitEnrollmentsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    user_nmec = serializers.CharField(max_length=32)
    user_name = serializers.CharField(max_length=256)
    accepted = serializers.BooleanField()
    admin_state = serializers.CharField(max_length=32)
    date = serializers.DateTimeField()
    options = serializers.SerializerMethodField()

    def get_options(self, obj):
        options = CourseUnitEnrollmentOptions.objects.filter(course_unit_enrollment__id=obj.id)
        return list(map(lambda option: CourseUnitEnrollmentOptionsSerializer(option).data, options))

class CourseUnitEnrollmentOptionsSerializer(serializers.Serializer):
    course_unit = serializers.SerializerMethodField()
    enrolling = serializers.BooleanField()
    course = serializers.SerializerMethodField()

    def get_course(self, obj):
        try:
            course_unit = CourseUnit.objects.get(id=obj.course_unit.id)
            return model_to_dict(course_unit.course)
        except:
            return None

    def get_course_unit(self, obj):
        course_unit_id = obj.course_unit.id

        try:
            return model_to_dict(CourseUnit.objects.get(pk=course_unit_id))
        except:
            return None
