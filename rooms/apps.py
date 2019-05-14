from django.apps import AppConfig
from django.db.utils import OperationalError

class RoomsConfig(AppConfig):
    name = 'rooms'

    def _ready(self):
        from events.models import Channel
        from .models import RoomChannel
        Channel.objects.all().delete()
        RoomChannel.objects.all().delete()

    def ready(self):
        try:
            return self._ready()
        except:
            pass
