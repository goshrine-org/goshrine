from django.db import models
from django.utils import timezone
from django.core.validators import validate_slug, MinLengthValidator

class RoomNameField(models.CharField):
    default_validators = [
        validate_slug,
        MinLengthValidator(1)
    ]

class Room(models.Model):
    name       = RoomNameField(max_length=32, unique=True, blank=False)
    created_at = models.DateTimeField(default=timezone.now)
    owner      = models.ForeignKey('users.User', on_delete=models.CASCADE,
                                   related_name='rooms_owned')

class Message(models.Model):
    text       = models.CharField(max_length=200)
    created_at = models.DateTimeField(default=timezone.now)
    user       = models.ForeignKey('users.User', on_delete=models.CASCADE,
                                   related_name='messages')
    room       = models.ForeignKey('rooms.Room', on_delete=models.CASCADE,
                                   related_name='messages')
