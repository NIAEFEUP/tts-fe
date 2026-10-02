import csv

from rest_framework.views import APIView
from django.http import HttpResponse

from exchange.models import DirectExchange, DirectExchangeParticipants, ExchangeAdmin

class ExchangeExportView(APIView):
    def get(self, request):
        if not ExchangeAdmin.objects.filter(username=request.user.username).exists():
            response = HttpResponse()
            response.status_code = 403
            return response

        response = HttpResponse(
            content_type="text/csv",
            headers={"Content-Disposition": 'attachment; filename="exchange_data.csv"'},
        )

        writer = csv.writer(response)
        writer.writerow(["student", "course_unit", "old_class", "new_class"])

        direct_exchange_ids = DirectExchangeParticipants.objects.filter(
            direct_exchange__accepted=True
        ).values_list('direct_exchange', flat=True)
        direct_exchanges = DirectExchange.objects.filter(id__in=direct_exchange_ids).order_by('date')

        for exchange in direct_exchanges:
            participants = DirectExchangeParticipants.objects.filter(direct_exchange=exchange).order_by('date')
            for participant in participants:
                writer.writerow([
                    participant.participant_nmec,
                    participant.course_unit_id,
                    participant.class_participant_goes_from,
                    participant.class_participant_goes_to
                ])

        return response


