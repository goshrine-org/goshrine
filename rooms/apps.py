from django.apps import AppConfig
from django.db.utils import OperationalError

class RoomsConfig(AppConfig):
    name = 'rooms'

    def _ready(self):
        from .models import RoomUser
        RoomUser.objects.all().delete()

    def ready(self):
        try:
            return self._ready()
        except:
            pass
