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

class RoomUser(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['room', 'user'], name='unique_room_user')
        ]

    room  = models.ForeignKey('rooms.Room', related_name='+', on_delete=models.CASCADE)
    user  = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE)
    count = models.PositiveSmallIntegerField(blank=True, null=False, default=1)

class Message(models.Model):
    id         = models.BigAutoField(unique=True, primary_key=True)
    text       = models.CharField(max_length=200)
    created_at = models.DateTimeField(default=timezone.now)
    user       = models.ForeignKey('users.User', on_delete=models.CASCADE,
                                   related_name='messages')
    room       = models.ForeignKey('rooms.Room', on_delete=models.CASCADE,
                                   related_name='messages')
