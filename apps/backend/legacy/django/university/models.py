# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class Course(models.Model):
    id = models.IntegerField(primary_key=True)
    faculty = models.ForeignKey('Faculty', models.DO_NOTHING)
    name = models.CharField(max_length=200)
    acronym = models.CharField(max_length=10)
    course_type = models.CharField(max_length=2)
    year = models.IntegerField()
    url = models.CharField(max_length=2000)
    plan_url = models.CharField(max_length=2000)
    last_updated = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'course'
        unique_together = (('id', 'faculty', 'year'),)

class CourseUnit(models.Model):
    id = models.IntegerField(primary_key=True, null=False)
    course = models.ForeignKey(Course, models.DO_NOTHING)
    name = models.CharField(max_length=200, null=False)
    acronym = models.CharField(max_length=16, null=False)
    url = models.CharField(max_length=2000, null=False)
    semester = models.IntegerField(null=False)
    year = models.SmallIntegerField(null=False)
    schedule_url = models.CharField(max_length=2000, blank=True, null=True, default="")
    last_updated = models.DateTimeField(null=False)
    hash = models.CharField(max_length=64, blank=True, null=True, default="")

    class Meta:
        managed = True
        db_table = 'course_unit'
        unique_together = (('id', 'course', 'year', 'semester'),)

class CourseMetadata(models.Model):
    course = models.OneToOneField(Course, models.DO_NOTHING, primary_key=True)  # The composite primary key (course_id, course_unit_id, course_unit_year) found, that is not supported. The first column is selected.
    course_unit = models.ForeignKey('CourseUnit', models.DO_NOTHING)
    course_unit_year = models.IntegerField()
    ects = models.FloatField()

    class Meta:
        managed = True
        db_table = 'course_metadata'
        unique_together = (('course', 'course_unit', 'course_unit_year'), ('course', 'course_unit', 'course_unit_year'),)

class Class(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=31, null=False)
    vacancies = models.IntegerField(null=True, blank=True, default=None)
    course_unit = models.ForeignKey('CourseUnit', models.DO_NOTHING)
    last_updated = models.DateTimeField()

    def from_course_unit(course_unit_id, class_acronym):
        return Class.objects.filter(course_unit__id=course_unit_id, name=class_acronym.split("+")[0]).first()

    class Meta:
        managed = True
        db_table = 'class'
        unique_together = (('name', 'course_unit'),)

class Faculty(models.Model):
    acronym = models.CharField(primary_key=True, max_length=10)
    name = models.TextField(blank=True, null=True)
    last_updated = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'faculty'


class Info(models.Model):
    date = models.DateTimeField(primary_key=True)

    class Meta:
        managed = True
        db_table = 'info'

class Professor(models.Model):
    id = models.IntegerField(primary_key=True)
    professor_acronym = models.CharField(max_length=32, blank=True, null=True)
    professor_name = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'professor'


class Slot(models.Model):
    id = models.IntegerField(primary_key=True)
    lesson_type = models.CharField(max_length=3)
    day = models.IntegerField()
    start_time = models.DecimalField(max_digits=3, decimal_places=1)
    duration = models.DecimalField(max_digits=3, decimal_places=1)
    location = models.CharField(max_length=31)
    is_composed = models.IntegerField()
    professor_id = models.IntegerField(blank=True, null=True)
    last_updated = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'slot'


class SlotClass(models.Model):
    id = models.BigAutoField(primary_key=True, auto_created=True)
    slot = models.ForeignKey(Slot, models.DO_NOTHING)
    class_field = models.ForeignKey(Class, models.DO_NOTHING, db_column='class_id')  # Field renamed because it was a Python reserved word.

    class Meta:
        managed = True
        db_table = 'slot_class'
        unique_together = (('slot', 'class_field'))


class SlotProfessor(models.Model):
    slot = models.OneToOneField(Slot, models.DO_NOTHING, primary_key=True)  # The composite primary key (slot_id, professor_id) found, that is not supported. The first column is selected.
    professor = models.ForeignKey(Professor, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'slot_professor'
        unique_together = (('slot', 'professor'),)



class CourseGroup(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    year = models.IntegerField()
    semester = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'course_group'


class CourseUnitCourseGroup(models.Model):
    course_unit = models.ForeignKey('CourseUnit', on_delete=models.CASCADE)
    course_group = models.ForeignKey('CourseGroup', on_delete=models.CASCADE)

    class Meta:
        managed = True
        db_table = 'course_unit_course_group'
        unique_together = (('course_unit', 'course_group'),)
