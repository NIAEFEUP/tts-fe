from django.forms.models import model_to_dict
from rest_framework import serializers

from university.models import CourseUnit
from university.controllers.ClassController import ClassController

class MarketplaceExchangeSerializer(serializers.Serializer):
    issuer_nmec = serializers.CharField(max_length=32)
    issuer_name = serializers.CharField(max_length=256)
    accepted = serializers.BooleanField()
    canceled = serializers.BooleanField()
    admin_state = serializers.CharField(max_length=32)
    hash = serializers.CharField(max_length=64)
    date = serializers.DateTimeField()

class MarketplaceExchangeClassSerializer(serializers.Serializer):
    course_info = serializers.SerializerMethodField()
    class_issuer_goes_from = serializers.SerializerMethodField()
    class_issuer_goes_to = serializers.SerializerMethodField()

    def get_course_info(self, obj):
        course_unit_id = obj.course_unit_id

        try:
            return model_to_dict(CourseUnit.objects.get(pk=course_unit_id))
        except:
            return None

    def get_class_issuer_goes_from(self, obj):
        class_issuer_id = obj.class_issuer_goes_from.split("+")[0]
        classes = ClassController.get_classes(obj.course_unit_id, new_schedule_api=True)
        filtered_classes = list(filter(lambda x: x['name'] == class_issuer_id, classes))
        try:
            return filtered_classes[0]
        except:
            return None

    def get_class_issuer_goes_to(self, obj):
        class_issuer_id = obj.class_issuer_goes_to.split("+")[0]
        classes = ClassController.get_classes(obj.course_unit_id, new_schedule_api=True)
        filtered_classes = list(filter(lambda x: x['name'] == class_issuer_id, classes))
        try:
            return filtered_classes[0]
        except:
            return None
