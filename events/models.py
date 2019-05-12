from django.db import models

class Channel(models.Model):
    channel = models.CharField(max_length=64, primary_key=True)
    user    = models.ForeignKey('users.User', related_name='channels', on_delete=models.CASCADE)
