from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.http import AsgiHandler
from django.urls import path, re_path
from events import consumers as events_consumers
import events.routing

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            events.routing.websocket_urlpatterns
        )
    ),
})
