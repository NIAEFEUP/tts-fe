import re

from django.http import HttpResponseForbidden


class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.auth_paths = [
            '/logout/',
            '/student/schedule/',
            re.compile(r'^/student/\w+/photo/$'),
            re.compile(r'^/schedule_sigarra/\d+/$'),
            re.compile(r'^/class_sigarra_schedule/\d+/.+/$'),
            re.compile(r'^/exchange/marketplace/$'),
            re.compile(r'^/exchange/direct/$'),
            re.compile(r'^/exchange/options/$'),
            '/is_admin/',
            '/export/',
            '/direct_exchange/history/',
            '/marketplace_exchange/',
            '/submit_marketplace_exchange/',
        ]

    def __call__(self, request):
        in_paths = False

        for path in self.auth_paths:
            if isinstance(path, str) and request.path == path:
                in_paths = True
                break
            elif isinstance(path, re.Pattern) and path.match(request.path):
                in_paths = True
                break

        if not in_paths:
            return self.get_response(request)

        if not request.user.is_authenticated:
            return HttpResponseForbidden()

        return self.get_response(request)

