import json
from datetime import datetime

from django.http import JsonResponse
from django.views import View
from django.utils import timezone

from exchange.models import ExchangeExpirations, ExchangeAdminCourses
from university.models import CourseUnit

class ExchangeCoursePeriodDetailView(View):
    def put(self, request, course_id, period_id):
        try:
            data = json.loads(request.body.decode('utf-8'))
            start_date_str = data.get('startDate')
            end_date_str = data.get('endDate')
        except (json.JSONDecodeError, UnicodeDecodeError):
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        if not ExchangeAdminCourses.objects.filter(
            exchange_admin__username=request.user.username,
            course=course_id
        ).exists():
            return JsonResponse({"error": "Sem permissões suficientes"}, status=403)

        if not (start_date_str and end_date_str):
            return JsonResponse({"error": "Parâmetros obrigatórios ausentes"}, status=400)

        try:
            start_date = timezone.make_aware(
                datetime.strptime(start_date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
            )
            end_date = timezone.make_aware(
                datetime.strptime(end_date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
            )
        except ValueError as e:
            return JsonResponse({"error": f"Formato de data inválido: {str(e)}"}, status=400)

        if start_date >= end_date:
            return JsonResponse({"error": "A data de início deve ser anterior à data do fim"}, status=400)

        course_units = CourseUnit.objects.filter(course__id=course_id)

        expiration = ExchangeExpirations.objects.filter(id=period_id).first()
        if not expiration:
            return JsonResponse({"error": "Este período de troca não existe."}, status=404)

        old_start_date = expiration.active_date
        old_end_date = expiration.end_date

        for cu in course_units:
            overlaps = ExchangeExpirations.objects.filter(
                course_unit=cu,
                active_date__lt=end_date,
                end_date__gt=start_date
            ).exclude(active_date=old_start_date, end_date=old_end_date)

            if overlaps.exists():
                return JsonResponse({"error": "Este período de troca se sobrepõe a um período existente."}, status=400)

        ExchangeExpirations.objects.filter(
            course_unit__in=course_units,
            active_date=old_start_date,
            end_date=old_end_date
        ).update(active_date=start_date, end_date=end_date)

        return JsonResponse({"message": "Exchange period updated successfully"}, status=200)

    def delete(self, request, course_id, period_id):
        if not ExchangeAdminCourses.objects.filter(
            exchange_admin__username=request.user.username,
            course=course_id
        ).exists():
            return JsonResponse({"error": "You do not have admin permissions"}, status=403)

        expiration = ExchangeExpirations.objects.filter(id=period_id).first()
        if not expiration:
            return JsonResponse({"error": "Exchange period not found"}, status=404)

        old_start_date = expiration.active_date
        old_end_date = expiration.end_date

        course_units = CourseUnit.objects.filter(course__id=course_id)

        deleted_count, _ = ExchangeExpirations.objects.filter(
            course_unit__in=course_units,
            active_date=old_start_date,
            end_date=old_end_date
        ).delete()

        if deleted_count == 0:
            return JsonResponse({"error": "No matching exchange periods found to delete"}, status=404)

        return JsonResponse({"message": f"{deleted_count} exchange period(s) deleted successfully"}, status=200)

