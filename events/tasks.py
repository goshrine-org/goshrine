from django.utils import timezone
from datetime import timedelta
from celery import shared_task
from .models import Channel
import logging

@shared_task(name='events.tasks.prune_channels')
def prune_channels():
    num_deleted, num_per_type = Channel.objects.filter(
	last_seen__lt=timezone.now() - timedelta(seconds=30)
    ).delete()
#        if num_deleted > 0:
#            self.broadcast_changed(bulk_change=True)
