"""
ASGI config for tts_be project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application

# import socketio
# from university.socket.views import sessions_server

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tts_be.settings')

application = get_asgi_application()
