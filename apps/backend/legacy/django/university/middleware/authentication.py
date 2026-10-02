from django.http import HttpResponseForbidden
from functools import wraps

def is_authenticated(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponseForbidden("Autenticação necessária")

        return view_func(request, *args, **kwargs)
    return _wrapped_view

