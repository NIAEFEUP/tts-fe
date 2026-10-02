import json
import datetime

from django.http import JsonResponse
from django.views import View
from django.utils import timezone

from exchange.models import ExchangeExpirations, ExchangeAdminCourseUnits

class ExchangeCourseUnitPeriodView(View):

    def post(self, request, course_unit_id):
        start_date_str = request.POST.get('startDate')
        end_date_str = request.POST.get('endDate')

        is_course_admin = ExchangeAdminCourseUnits.objects.filter(
            exchange_admin__username=request.user.username,
            course_unit__id=course_unit_id
        ).exists()

        if not is_course_admin:
            return JsonResponse({"error": "Sem permissões suficientes"}, status=403)

        if not course_unit_id or not start_date_str or not end_date_str:
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
            ).exists():
                return JsonResponse({"error": "Este período de troca se sobrepõe a um período existente."}, safe=False, status=400)

        exchange_expiration = ExchangeExpirations(
            course_unit_id=course_unit_id,
            active_date=start_date,
            end_date=end_date
        )
        exchange_expiration.save()

        return JsonResponse({"success": True}, safe=False)
    
