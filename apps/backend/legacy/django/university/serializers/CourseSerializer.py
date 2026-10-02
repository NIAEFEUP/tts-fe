from rest_framework import serializers

class CourseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    faculty_id = serializers.CharField()
    name = serializers.CharField()
    acronym = serializers.CharField()
    course_type = serializers.CharField()
    year = serializers.IntegerField()
    url = serializers.CharField()
    plan_url = serializers.CharField()
    last_updated = serializers.DateTimeField()