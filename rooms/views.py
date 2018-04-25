from django.shortcuts import render
from django.http import JsonResponse, Http404
from .models import Message, Room
from users.models import User
from django.utils.html import escape
from django.conf import settings
import json

def index(request):
    return render(request, 'rooms/index.html', {})

def members(request, room_id):
    try:
        room = Room.objects.get(pk=room_id)
    except Room.DoesNotExist:
       raise Http404()

    json_messages = []
    for user in room.users.all():
        msg = {}
        msg['id']         = user.id
        msg['login']      = user.login
        msg['rank']       = user.rank
        msg['avatar_pic'] = user.avatar_pic
        msg['user_type']  = ''
        msg['available']  = user.available
        json_messages.append(msg)

    params = { 'separators': (',', ':') }
    return JsonResponse(json_messages, safe=False, json_dumps_params=params)

def messages(request, room_id):
    try:
        room = Room.objects.get(pk=room_id)
    except Room.DoesNotExist:
       raise Http404()

    messages      = room.messages.all().order_by('created_at')
    json_messages = []
    for message in messages:
        # XXX: we assume the timezone is UTC here.  This is to remain
        # compatible with Javascript, and later we need to check the
        # implications of having the Django timezone not set to UTC.
        # The Zulu suffix will be wrong.
        msg               = {}
        msg['created_at'] = message.created_at.strftime('%Y-%m-%dT%H:%M:%SZ')
        msg['text']       = escape(message.text)
        msg['user']       = message.user.login
        msg['user_id']    = message.user.id
        json_messages.append(msg)

    params = { 'separators': (',', ':') }
    return JsonResponse(json_messages, safe=False, json_dumps_params=params)
