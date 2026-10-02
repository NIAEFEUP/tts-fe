from rest_framework import serializers
from django.db import models

from university.models import Slot, SlotClass
from university.controllers.ClassController import ClassController

class ClassSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=31)
    last_updated = serializers.DateTimeField()
    slots = serializers.SerializerMethodField()

    def get_slots(self, obj):
        slot_classes = SlotClass.objects.filter(class_field=obj)

        slot_ids = [sc.slot.id for sc in slot_classes]
        slots = Slot.objects.filter(id__in=slot_ids)

        return list(map(ClassController.get_professors, slots))

