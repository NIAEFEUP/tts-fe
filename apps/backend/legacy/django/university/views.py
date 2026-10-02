from django.utils import timezone
from django.http.response import HttpResponse
from university.exchange.utils import get_student_data
from university.models import Faculty
from university.models import Course
from university.models import CourseUnit
from university.models import Professor
from university.models import SlotProfessor
from university.models import CourseMetadata
from university.models import Info
from university.models import Info
from university.models import CourseGroup
from university.models import CourseUnitCourseGroup
from university.controllers.ClassController import ClassController
from university.response.errors import course_unit_not_found_error
from django.http import JsonResponse
from rest_framework.decorators import api_view
import requests
from rest_framework import status

from django.utils import timezone
from django.forms.models import model_to_dict

from tts_be.settings import CONFIG, FEDERATED_AUTH

from university.controllers.SigarraController import SigarraController

from django.contrib.auth import get_user_model, login

def get_field(value):
    return value.field

if not FEDERATED_AUTH:
    @api_view(['POST'])
    def sigarra_login(request):
        try:
            # --- Login no Sigarra ---
            sigarra_controller = SigarraController()
            sigarra_controller.login()

            # --- Buscar username do ficheiro de configuração ---
            username = CONFIG.get("SIGARRA_USERNAME")
            if not username:
                return JsonResponse(
                    {"error": "SIGARRA_USERNAME not configured in CONFIG"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # --- Buscar ou criar utilizador local ---
            User = get_user_model()
            email = f"{username}@up.pt"
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "email": email,
                    "first_name": "John",
                    "last_name": "Doe",
                },
            )

            # --- Login do utilizador ---
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            # --- Resposta ---
            return JsonResponse(
                {
                    "message": "Login successful",
                    "created": created,
                    "username": username,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return JsonResponse(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

@api_view(['GET'])
def faculty(request):
    json_data = list(Faculty.objects.values())
    return JsonResponse(json_data, safe=False)


"""
    Returns all the major/major.
    REQUEST: http://localhost:8000/course/<int:year>
"""


@api_view(['GET'])
def course(request, year):
    json_data = list(Course.objects.filter(year=year).values())
    return JsonResponse(json_data, safe=False)

@api_view(['GET'])
def course_groups(request, course_id):
    json_data=list(CourseGroup.objects.filter(course_id=course_id).values())
    return JsonResponse(json_data, safe=False)

@api_view(['GET'])
def course_group_course_units(request, course_group_id):

    course_unit_ids = CourseUnitCourseGroup.objects.filter(
        course_group_id=course_group_id
    ).values_list('course_unit_id', flat=True)
    
    course_units = CourseUnit.objects.filter(id__in=course_unit_ids).values()
    
    return JsonResponse(list(course_units), safe=False)


@api_view(['GET'])
def course_unit_by_id(request, course_unit_id):
    course_unit = CourseUnit.objects.filter(id=course_unit_id).first()
    if (course_unit == None):
        return JsonResponse(course_unit_not_found_error(course_unit_id), status=status.HTTP_404_NOT_FOUND)

    return JsonResponse(model_to_dict(course_unit), safe=False)


"""
    Return all the units from a course/major.
    REQUEST: course_units/<int:course_id>/<int:year>/<int:semester>/
"""


@api_view(['GET'])
def course_units(request, course_id, year, semester):
    # Fetch CourseUnitYear model instances that match the attributes from the api url parameters.
    course_units_metadata = CourseMetadata.objects.filter(
        course__id=course_id, course_unit__semester=semester, course__year=year).select_related('course_unit').order_by('course_unit_year')

    json_data = list()

    # For each object in those course unit year objects we append the CourseUnit dictionary
    for course_unit_metadata in course_units_metadata:
        course_unit_metadata.__dict__.update(
            course_unit_metadata.course_unit.__dict__)

        del course_unit_metadata.__dict__["_state"]

        json_data.append(course_unit_metadata.__dict__)

    return JsonResponse(json_data, safe=False)

"""
    Returns the classes of a course unit.
"""
@ api_view(['GET'])
def classes(request, course_unit_id):
    return JsonResponse(ClassController.get_classes(course_unit_id, new_schedule_api=True), safe=False)

"""
    Returns all the professors of a class of the class id
"""


@ api_view(["GET"])
def professor(request, slot):
    slot_professors = list(SlotProfessor.objects.filter(slot_id=slot).values())

    professors = []

    for slot_professor in slot_professors:
        professor = Professor.objects.get(id=slot_professor['professor_id'])
        professors.append({
            'id': professor.id,
            'acronym': professor.professor_acronym,
            'name': professor.professor_name
        })

    return JsonResponse(professors, safe=False)


"""
    Returns the contents of the info table
"""


@ api_view(["GET"])
def info(request):
    info = Info.objects.first()
    if info:
        json_data = {
            'date': timezone.localtime(info.date).strftime('%Y-%m-%d %H:%M:%S')
        }
        return JsonResponse(json_data, safe=False)
    else:
        return JsonResponse({}, safe=False)

"""
    Returns student data
"""    
@api_view(["GET"])
def student_data(request, codigo):
    try:
        response = get_student_data(codigo, request.COOKIES)

        if(response.status_code != 200):
            return HttpResponse(status=response.status_code)

        new_response = JsonResponse(response.json(), safe=False)

        new_response.status_code = response.status_code

        return new_response

    except requests.exceptions.RequestException as e:
        return JsonResponse({"error": e}, safe=False)

"""
    Verifies if course units have the correct hash
"""
@api_view(['GET'])
def get_course_unit_hashes(request):
    ids_param = request.query_params.get('ids', '')

    try:
        course_unit_ids = [int(id) for id in ids_param.split(',') if id]
    except ValueError:
        return JsonResponse({'error': 'Invalid ID format'}, status=400)

    results = {}

    for course_unit_id in course_unit_ids:
        try:
            course_unit = CourseUnit.objects.get(id=course_unit_id)
            results[course_unit_id] = course_unit.hash
        except CourseUnit.DoesNotExist:
            results[course_unit_id] = None

    return JsonResponse(results, safe=False)
