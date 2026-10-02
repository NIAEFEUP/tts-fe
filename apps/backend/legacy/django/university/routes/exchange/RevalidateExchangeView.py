import base64
import jwt
import datetime
import os

from django.http import JsonResponse
from django.views import View
from django.utils.html import strip_tags
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from tts_be.settings import JWT_KEY, VERIFY_EXCHANGE_TOKEN_EXPIRATION_SECONDS, DOMAIN


from exchange.models import DirectExchange, DirectExchangeParticipants

class RevalidateExchangeView(View):
    @method_decorator(ratelimit(key='user', rate='1/h', block=True), name='post')    
    def post(self, request, exchange_id):
        username = request.user.username
        exchange_model = DirectExchange.objects.filter(id=exchange_id).first()
        
        if exchange_model is None:
            return JsonResponse({"success": False}, status=400, safe=False)
        
        exchanges = DirectExchangeParticipants.objects.filter(direct_exchange=exchange_model)
        filtered_exchanges = [inserted_exchange for inserted_exchange in exchanges if inserted_exchange.participant_nmec == username]

        if (len(filtered_exchanges) == 0):
            return JsonResponse({"success": False},  status=400, safe=False)

        token = jwt.encode({"username": username, "exchange_id": exchange_model.id, "exp": (datetime.datetime.now() + datetime.timedelta(seconds=VERIFY_EXCHANGE_TOKEN_EXPIRATION_SECONDS)).timestamp()}, JWT_KEY, algorithm="HS256")

        base64_token = base64.b64encode(token.encode('utf-8')).decode('utf-8')
        html_message = render_to_string('confirm_exchange.html', {'confirm_link': f"{DOMAIN}/exchange/verify/{base64_token}", 'exchanges' : filtered_exchanges})
        try:
            send_mail(
                'Confirmação de troca',
                strip_tags(html_message),
                os.getenv('SENDER_EMAIL_ADDRESS'),
                [f'up{username}@up.pt']
            )
        except Exception as e:
            print("Error: ", e)
        
        return JsonResponse({"success": True}, safe=False)
        
