from django.db import models
from django.utils import timezone

from university.models import Course, CourseUnit, Class

class CourseUnitEnrollmentOptions(models.Model):
    course_unit = models.ForeignKey(CourseUnit, models.DO_NOTHING)
    enrolling = models.BooleanField(blank=True, null=True, default=True)
    course_unit_enrollment = models.ForeignKey('CourseUnitEnrollments', models.DO_NOTHING)
    date = models.DateTimeField(blank=True, null=True, default=timezone.now)

    class Meta:
        managed = True
        db_table = 'course_unit_enrollment_options'


class CourseUnitEnrollments(models.Model):
    user_nmec = models.CharField(max_length=32)
    user_name = models.CharField(max_length=256, default='')
    accepted = models.BooleanField(blank=True, null=True, default=False)
    admin_state = models.CharField(max_length=32, default='untreated')
    date = models.DateTimeField(blank=True, null=True, default=timezone.now)

    class Meta:
        managed = True
        db_table = 'course_unit_enrollments'


class DirectExchange(models.Model):
    issuer_name = models.CharField(max_length=256)
    issuer_nmec = models.CharField(max_length=32)
    accepted = models.BooleanField()
    canceled = models.BooleanField(blank=True, null=True, default=False)
    date = models.DateTimeField(blank=True, null=True, default=timezone.now)
    last_validated = models.DateTimeField(blank=True, null=True)
    admin_state = models.CharField(max_length=32, default='untreated')
    marketplace_exchange = models.ForeignKey('MarketplaceExchange', models.DO_NOTHING, db_column='marketplace_exchange', blank=True, null=True)
    hash = models.CharField(max_length=64, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'direct_exchange'


class DirectExchangeParticipants(models.Model):
    participant_name = models.CharField(max_length=256)
    participant_nmec = models.CharField(max_length=32)
    class_participant_goes_from = models.CharField(max_length=16)
    class_participant_goes_to = models.CharField(max_length=16)
    course_unit = models.CharField(max_length=64)
    course_unit_id = models.CharField(max_length=16)
    direct_exchange = models.ForeignKey(DirectExchange, models.DO_NOTHING, db_column='direct_exchange')
    accepted = models.BooleanField()
    date = models.DateTimeField(blank=True, null=True, default=timezone.now)

    class Meta:
        managed = True
        db_table = 'direct_exchange_participants'

class ExchangeAdmin(models.Model):
    username = models.CharField(unique=True, max_length=32)

    class Meta:
        managed = True
        db_table = 'exchange_admin'

class ExchangeAdminCourseUnits(models.Model):
    exchange_admin = models.ForeignKey(ExchangeAdmin, models.DO_NOTHING)
    course_unit = models.ForeignKey(CourseUnit, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'exchange_admin_course_units'


class ExchangeAdminCourses(models.Model):
    exchange_admin = models.ForeignKey(ExchangeAdmin, models.DO_NOTHING)
    course = models.ForeignKey(Course, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'exchange_admin_courses'


class ExchangeExpirations(models.Model):
    course_unit = models.ForeignKey(CourseUnit, models.DO_NOTHING)
    active_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_course_expiration = models.BooleanField(default=False)
    class Meta:
        managed = True
        db_table = 'exchange_expirations'


class ExchangeUrgentRequestOptions(models.Model):
    class_issuer_goes_from = models.CharField(max_length=16)
    class_issuer_goes_to = models.CharField(max_length=16)
    course_unit = models.ForeignKey(CourseUnit, models.DO_NOTHING)
    exchange_urgent_request = models.ForeignKey('ExchangeUrgentRequests', models.DO_NOTHING)
    date = models.DateTimeField(blank=True, null=True, default=timezone.now)

    class Meta:
        managed = True
        db_table = 'exchange_urgent_request_options'


class ExchangeUrgentRequests(models.Model):
    issuer_name = models.CharField(max_length=256, default=None, null=True)
    issuer_nmec = models.CharField(max_length=32)
    accepted = models.BooleanField(blank=True, null=True, default=False)
    message = models.CharField(max_length=2048)
    date = models.DateTimeField(blank=True, null=True, default=timezone.now)
    hash = models.CharField(max_length=64, blank=True, null=True)
    admin_state = models.CharField(max_length=32, default='untreated')

    class Meta:
        managed = True
        db_table = 'exchange_urgent_requests'

class MarketplaceExchange(models.Model):
    issuer_name = models.CharField(max_length=256)
    issuer_nmec = models.CharField(max_length=32)
    accepted = models.BooleanField()
    canceled = models.BooleanField(blank=True, null=True, default=False)
    date = models.DateTimeField(blank=True, null=True, default=timezone.now)
    hash = models.CharField(max_length=64, blank=True, null=True)
    admin_state = models.CharField(max_length=32, default='untreated')

    class Meta:
        managed = True
        db_table = 'marketplace_exchange'

class MarketplaceExchangeClass(models.Model):
    marketplace_exchange = models.ForeignKey(MarketplaceExchange, models.DO_NOTHING, db_column='marketplace_exchange')
    course_unit_name = models.CharField(max_length=256)
    course_unit_acronym = models.CharField(max_length=256)
    course_unit_id = models.CharField(max_length=256)
    class_issuer_goes_from = models.CharField(max_length=16)
    class_issuer_goes_to = models.CharField(max_length=16)
    date = models.DateTimeField(blank=True, null=True, default=timezone.now)

    class Meta:
        managed = True
        db_table = 'marketplace_exchange_class'

class StudentCourseMetadata(models.Model):
    nmec = models.CharField(max_length=255)
    fest_id = models.IntegerField()
    course = models.ForeignKey(Course, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'student_course_metadata'

class UserCourseUnits(models.Model):
    user_nmec = models.CharField(max_length=32)
    course_unit = models.ForeignKey(CourseUnit, models.DO_NOTHING)
    class_field = models.ForeignKey(Class, models.DO_NOTHING, db_column='class_id')  # Field renamed because it was a Python reserved word.

    class Meta:
        managed = True
        db_table = 'user_course_units'

