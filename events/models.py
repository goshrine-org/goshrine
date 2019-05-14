from django.db import models
from django.utils import timezone

class Channel(models.Model):
    channel   = models.CharField(max_length=128, primary_key=True)
    user      = models.ForeignKey('users.User', related_name='channels', on_delete=models.CASCADE)
    last_seen = models.DateTimeField(default=timezone.now)
