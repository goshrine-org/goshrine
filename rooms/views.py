from django.shortcuts import render
from django.http import JsonResponse, Http404
from .models import Message, Room
from users.models import User
import json

def index(request):
    return render(request, 'rooms/index.html', {})

def messages(request, room_id):
    try:
        Room.objects.get(pk=room_id)
    except Room.DoesNotExist:
       raise Http404()

    messages = Message.objects.filter(room__pk=room_id)
    messages = messages.order_by('-created_at')

    json_messages = []
    for message in messages:
        # XXX: we assume the timezone is UTC here.  This is to remain
        # compatible with Javascript, and later we need to check the
        # implications of having the Django timezone not set to UTC.
        # The Zulu suffix will be wrong.
        msg               = {}
        msg['created_at'] = message.created_at.strftime('%Y-%m-%dT%H:%M:%SZ')
        msg['text']       = message.text
        msg['user']       = message.user.login
        msg['user_id']    = message.user.id
        json_messages.append(msg)

    params = { 'separators': (',', ':') }
    return JsonResponse(json_messages, safe=False, json_dumps_params=params)
