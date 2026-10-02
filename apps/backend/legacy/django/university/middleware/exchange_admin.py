from django.http import HttpResponseForbidden
from functools import wraps

from exchange.models import ExchangeAdmin

def exchange_admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponseForbidden("Autenticação necessária")

        # Check if the user exists in the ExchangeAdmin table
        if not ExchangeAdmin.objects.filter(username=request.user.username).exists():
            return HttpResponseForbidden("Sem permissões suficientes")
        
        # Proceed with the original view
        return view_func(request, *args, **kwargs)
    return _wrapped_view
