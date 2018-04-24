from django.apps import AppConfig

class UsersConfig(AppConfig):
    name = 'users'

    def ready(self):
        from .models import User
        User.objects.filter(room__isnull=False).update(room=None)
