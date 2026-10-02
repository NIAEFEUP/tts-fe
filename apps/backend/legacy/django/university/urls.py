from django.urls import path, include

from university.routes.docs.DocsView import SwaggerUIView, OpenAPISchemaView
from university.routes.course_unit.CourseUnitEnrollmentView import CourseUnitEnrollmentView
from university.routes.exchange.AdminMarketplaceView import AdminMarketplaceView
from university.routes.MarketplaceExchangeView import MarketplaceExchangeView
from university.routes.auth.Csrf import Csrf
from university.routes.exchange.DirectExchangeView import DirectExchangeView
from university.routes.exchange.export.ExchangeExportView import ExchangeExportView
from university.routes.student.course_units.eligible.StudentEligibleCourseUnits import StudentEligibleCourseUnits
from university.routes.student.exchange.StudentReceivedExchangesView import StudentReceivedExchangesView
from university.routes.student.exchange.StudentSentExchangesView import StudentSentExchangesView
from university.routes.student.schedule.StudentScheduleView import StudentScheduleView
from university.routes.exchange.ExchangeCancelView import ExchangeCancelView
from university.routes.auth.InfoView import InfoView
from university.routes.exchange.AdminExchangeRequestRejectView import AdminExchangeRequestRejectView
from university.routes.exchange.AdminExchangeRequestAcceptView import AdminExchangeRequestAcceptView
from university.routes.student.StudentPhotoView import StudentPhotoView
from university.routes.exchange.card.metadata.ExchangeCardMetadataView import ExchangeCardMetadataView
from university.routes.exchange.verify.ExchangeVerifyView import ExchangeVerifyView
from university.routes.admin.AdminExchangeCoursesView import AdminExchangeCoursesView
from university.routes.admin.AdminExchangeCourseUnitsView import AdminExchangeCourseUnitsView
from university.routes.exchange.ExchangeUrgentView import ExchangeUrgentView
from university.routes.exchange.RevalidateExchangeView import RevalidateExchangeView
from university.routes.student.StudentCourseMetadataView import StudentCourseMetadataView
from university.routes.exchange.AdminRequestAwaitingInformationView import AdminRequestAwaitingInformationView
from university.routes.exchange.ExchangeCourseUnitPeriodView import ExchangeCourseUnitPeriodView
from university.routes.exchange.ExchangeCoursePeriodView import ExchangeCoursePeriodView
from university.routes.exchange.ExchangeCourseUnitPeriodDetailView import ExchangeCourseUnitPeriodDetailView
from university.routes.exchange.ExchangeCoursePeriodDetailView import ExchangeCoursePeriodDetailView
from university.routes.admin.AdminExchangeCourseUnitPeriodsView import AdminExchangeCourseUnitPeriodsView
from university.routes.admin.AdminExchangeCoursePeriodsView import AdminExchangeCoursePeriodsView
from university.routes.exchange.related.ExchangeRelatedView import ExchangeRelatedView
from university.routes.admin.AdminExchangeClassesView import AdminExchangeClassesView
from university.routes.admin.AdminExchangeStatisticsView import AdminExchangeStatisticsView

from university.middleware.exchange_admin import exchange_admin_required
from university.middleware.authentication import is_authenticated
from university.routes.exchange.verify.DirectExchangeValidationView import DirectExchangeValidationView

from tts_be.settings import FEDERATED_AUTH

from . import views
from mozilla_django_oidc import views as oidc_views


# URLConf
urlpatterns = [
    path('faculty/', is_authenticated(views.faculty)),
    path('course/<int:year>', is_authenticated(views.course)),
    path('course/<int:course_id>/groups', is_authenticated(views.course_groups)),
    path('course_group/<int:course_group_id>/course_units', is_authenticated(views.course_group_course_units)),
    path('course_units/<int:course_id>/<int:year>/<int:semester>/', is_authenticated(views.course_units)),
    path('info/', is_authenticated(views.info)),
    path('auth/info/', InfoView.as_view()),
    path('csrf/', Csrf.as_view()),
    path('admin/courses/', exchange_admin_required(AdminExchangeCoursesView.as_view())),
    path('student/schedule', is_authenticated(StudentScheduleView.as_view()), name="auth-student-schedule"),
    path('student/<str:nmec>/schedule', exchange_admin_required(StudentScheduleView.as_view()), name="student-schedule"),
    path('student/exchange/sent/', is_authenticated(StudentSentExchangesView.as_view())),
    path('student/exchange/received/', is_authenticated(StudentReceivedExchangesView.as_view())),
    path('student/<str:nmec>/<int:course_id>/metadata', exchange_admin_required(StudentCourseMetadataView.as_view())),
    path('student/course_units/eligible', is_authenticated(StudentEligibleCourseUnits.as_view())),
    path('student/<str:nmec>/photo', is_authenticated(StudentPhotoView.as_view())),
    path('exchange/verify/<str:token>', is_authenticated(ExchangeVerifyView.as_view())),
    path('student_data/<str:codigo>/', is_authenticated(views.student_data)),
    path('exchange/marketplace/', is_authenticated(MarketplaceExchangeView.as_view())),
    path('exchange/direct/', is_authenticated(DirectExchangeView.as_view()), name="direct_exchange"),
    path('exchange/direct/<int:id>', is_authenticated(DirectExchangeView.as_view()), name="direct_exchange-id"),
    path('exchange/direct/validate/<int:id>', exchange_admin_required(DirectExchangeValidationView.as_view())),
    path('exchange/<str:request_type>/<int:id>/cancel/', is_authenticated(ExchangeCancelView.as_view())),
    path('exchange/export/csv', exchange_admin_required(ExchangeExportView.as_view())),
    path('exchange/urgent/', is_authenticated(ExchangeUrgentView.as_view())),
    path('exchange/related/', is_authenticated(ExchangeRelatedView.as_view())),
    path('exchange/<int:exchange_id>/revalidate/', is_authenticated(RevalidateExchangeView.as_view()), name='revalidate_exchange'),
    path('course_unit/<int:course_unit_id>/exchange/metadata', is_authenticated(ExchangeCardMetadataView.as_view())),
    path('course_unit/<int:course_unit_id>/', is_authenticated(views.course_unit_by_id)),
    path('class/<int:course_unit_id>/', is_authenticated(views.classes)),
    path('professors/<int:slot>/', is_authenticated(views.professor)),
    path('course_unit/hash', is_authenticated(views.get_course_unit_hashes)),
    path('course_unit/enrollment/', is_authenticated(CourseUnitEnrollmentView.as_view())),

    path('oidc-auth/', include('mozilla_django_oidc.urls')),
    path('exchange/admin/courses/', exchange_admin_required(AdminExchangeCoursesView.as_view())),
    path('exchange/admin/course_units/', exchange_admin_required(AdminExchangeCourseUnitsView.as_view())),
    path('exchange/admin/classes/', exchange_admin_required(AdminExchangeClassesView.as_view())),
    path('exchange/admin/statistics/', exchange_admin_required(AdminExchangeStatisticsView.as_view())),
    path('exchange/admin/marketplace', exchange_admin_required(AdminMarketplaceView.as_view())),
    path('exchange/admin/course_unit/periods/', exchange_admin_required(AdminExchangeCourseUnitPeriodsView.as_view())),
    path('exchange/admin/courses/periods/', exchange_admin_required(AdminExchangeCoursePeriodsView.as_view())),
    path('exchange/admin/course_unit/<int:course_unit_id>/period/', exchange_admin_required(ExchangeCourseUnitPeriodView.as_view())),
    path('exchange/admin/course/<int:course_id>/period/', exchange_admin_required(ExchangeCoursePeriodView.as_view())),
    path('exchange/admin/course_unit/<int:course_unit_id>/period/<int:period_id>/', exchange_admin_required(ExchangeCourseUnitPeriodDetailView.as_view())),
    path('exchange/admin/course/<int:course_id>/period/<int:period_id>/', exchange_admin_required(ExchangeCoursePeriodDetailView.as_view())),
    path('exchange/admin/request/<str:request_type>/<int:id>/reject/', exchange_admin_required(AdminExchangeRequestRejectView.as_view())),
    path('exchange/admin/request/<str:request_type>/<int:id>/accept/', exchange_admin_required(AdminExchangeRequestAcceptView.as_view())),
    path('exchange/admin/request/<str:request_type>/<int:id>/awaiting-information/', exchange_admin_required(AdminRequestAwaitingInformationView.as_view())),
    path('api/oidc-auth/callback/', oidc_views.OIDCAuthenticationCallbackView.as_view(), name="api_oidc_authentication_callback"),
    path('docs/', SwaggerUIView.as_view(), name="swagger-ui"),
    path('schema/', OpenAPISchemaView.as_view(), name="openapi-schema"),
]

if FEDERATED_AUTH == 0:
    urlpatterns.append(path('sigarra_login/', views.sigarra_login))
