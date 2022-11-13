from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import events.routing
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "goshrine.settings")

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AuthMiddlewareStack(
        URLRouter(
            events.routing.websocket_urlpatterns
        )
    ),
})
