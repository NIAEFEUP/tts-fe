from django.forms.models import model_to_dict
from rest_framework import serializers

from university.models import CourseUnit
from university.controllers.ClassController import ClassController
from university.exchange.utils import convert_sigarra_schedule

from exchange.models import ExchangeUrgentRequestOptions

class ExchangeUrgentRequestSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    issuer_name = serializers.CharField(max_length=256)
    issuer_nmec = serializers.CharField(max_length=32)
    message = serializers.CharField(max_length=2048)
    accepted = serializers.BooleanField()
    admin_state = serializers.CharField(max_length=32)
    date = serializers.DateTimeField()
    options = serializers.SerializerMethodField()

    def get_options(self, obj):
        options = ExchangeUrgentRequestOptions.objects.filter(exchange_urgent_request__id=obj.id)
        return list(map(lambda option: ExchangeUrgentRequestOptionsSerializer(option).data, options))

class ExchangeUrgentRequestOptionsSerializer(serializers.Serializer):
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
