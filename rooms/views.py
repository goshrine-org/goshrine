from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, Http404
from django.db.models import F
from .models import Message, Room, RoomUser
from users.models import User
from game.models import Game
from django.utils.html import escape
from django.conf import settings
from common import flash
import json

def rooms(request, room_id):
    room = get_object_or_404(Room.objects, id=room_id)

    # Get the 11 most recent games from the database and pass them to render.
    games = Game.objects.filter(room=room_id).order_by('-started_at')[:11]

    flashes = flash.flashes_get(request)
    return render(request, 'home/index.html', {'flashes': flashes, 'games': games, 'room': room})

def index(request):
    return render(request, 'rooms/index.html', {})

def members(request, room_id):
    fields_as = ('id', 'login', 'rank', 'avatar_pic', 'user_type', 'available')
    fields_q  = ('user__' + field for field in fields_as)
    fields_as = { k: F(v) for (k, v) in zip(fields_as, fields_q) }

    # Create a JOIN over the roomchannel, channel, and user tables, then pick
    # the user fields we actually want.
    rcs = RoomUser.objects.filter(room_id=room_id) \
                     .select_related('user').values(*fields_q) \
                     .distinct().values(**fields_as)

    json_messages = []
    for user in rcs:
        msg = {}
        msg['id']         = user['id']
        msg['login']      = user['login']
        msg['rank']       = user['rank']
        msg['avatar_pic'] = user['avatar_pic']
        msg['user_type']  = user['user_type']
        msg['available']  = user['available']
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
