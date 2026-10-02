import json
import datetime

from django.http import JsonResponse
from django.views import View
from django.utils import timezone

from exchange.models import ExchangeExpirations, ExchangeAdminCourseUnits

class ExchangeCourseUnitPeriodDetailView(View):
    def put(self, request, course_unit_id, period_id):
        try:
            data = json.loads(request.body.decode('utf-8'))
            start_date_str = data.get('startDate')
            end_date_str = data.get('endDate')
        except (json.JSONDecodeError, UnicodeDecodeError):
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

        is_course_admin = ExchangeAdminCourseUnits.objects.filter(
            exchange_admin__username=request.user.username,
            course_unit__id=course_unit_id
        ).exists()

        if not is_course_admin:
            return JsonResponse({"error": "Sem permissões suficientes"}, status=403)

        if not course_unit_id or not period_id or not start_date_str or not end_date_str:
            return JsonResponse({"error": "Parâmetros obrigatórios ausentes"}, status=400)

        try:
            start_date = timezone.make_aware(
                datetime.datetime.strptime(start_date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
            )
            end_date = timezone.make_aware(
                datetime.datetime.strptime(end_date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
            )
        except ValueError as e:
            return JsonResponse({"error": f"Formato de data inválido: {str(e)}"}, status=400)

        if start_date >= end_date:
            return JsonResponse({"error": "A data de início deve ser anterior à data do fim"}, status=400)

        if ExchangeExpirations.objects.filter(
                course_unit_id=course_unit_id,
                active_date__lt=end_date,
                end_date__gt=start_date,
                is_course_expiration=False     
        ).exclude(id=period_id).exists():
            return JsonResponse({"error": "Este período de troca se sobrepõe a um período existente."}, status=400)

        exchange_expiration = ExchangeExpirations.objects.filter(
            id=period_id,
            course_unit_id=course_unit_id
        ).first()

        if exchange_expiration:
            exchange_expiration.active_date = start_date
            exchange_expiration.end_date = end_date
            exchange_expiration.is_course_expiration = False
            exchange_expiration.save()
        else:
            return JsonResponse({"error": "Periodo não existente"}, status=404)

        return JsonResponse({"success": True})

    def delete(self, request, course_unit_id, period_id):
        is_course_admin = ExchangeAdminCourseUnits.objects.filter(
            exchange_admin__username=request.user.username,
            course_unit__id=course_unit_id
        ).exists()

        if not is_course_admin:
            return JsonResponse({"error": "You do not have admin permissions"}, status=403)

        if not course_unit_id or not period_id:
            return JsonResponse({"error": "Missing required parameters"}, status=400)

        exchange_expiration = ExchangeExpirations.objects.filter(
            id=period_id,
            course_unit_id=course_unit_id
        ).first()

        if exchange_expiration:
            exchange_expiration.delete()
            return JsonResponse({"success": True})
        else:
            return JsonResponse({"error": "Period not found"}, status=404)
