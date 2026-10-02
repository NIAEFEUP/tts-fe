from django.views import View
from django.http.response import HttpResponse
from django.middleware.csrf import get_token

class Csrf(View):
    def get(self, request):
        response = HttpResponse()

        if("csrftoken" not in request.COOKIES):
            cookies = request.COOKIES
            response.COOKIES = cookies
            response.set_cookie('csrf', get_token(request))

        return response
