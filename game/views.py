from django.shortcuts import render
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db.models import Q
from .forms import MatchCreateForm, MatchProposeForm
from rooms.models import Room, RoomUser
from users.models import User

# XXX: called by application.js shit.  Later we need to set the CSRF
# cookie.
# https://stackoverflow.com/questions/6506897/csrf-token-missing-or-incorrect-while-post-parameter-via-ajax-in-django
@csrf_exempt
def match_create(request):
    if request.method != 'POST':
        raise Http404()

    form = MatchCreateForm(request.POST)
    if not form.is_valid():
        raise Http404()

    target_user_id = form.cleaned_data['challenged_player_id']
    room_id        = form.cleaned_data['room_id']

    try:
        with transaction.atomic():
            target_user = User.objects.get(pk=target_user_id)
            room        = Room.objects.get(pk=room_id)
    except (User.DoesNotExist, Room.DoesNotExist):
       raise Http404()

    context = {
        'target_user': target_user,
        'room'       : room
    }
    return render(request, 'game/match_create.html', context)

@csrf_exempt
def match_propose(request):
    if request.method != 'GET':
        raise Http404()

    form = MatchProposeForm(request.GET)
    if not form.is_valid():
        raise Http404()

    if request.user is None or not request.user.is_authenticated:
        raise Http404()

    room_id              = request.GET.get('room_id')
    challenged_player_id = request.GET.get('challenged_player_id')

    # We get the relevant entries for checking both users are in the same room.
    records = RoomUser.objects.filter(
        Q(room=room_id) & (
            Q(user=request.user) |
            Q(user=challenged_player_id)
        )
    ).values('user', 'room').distinct()

    # We selected distinct RoomUser rows over 'user' and 'room' ids.  We
    # should have 2 if everything went okay and both users are in the room.
    if records.count() != 2:
        raise Http404()

#    try:
#        challenged_user = User.objects.get(pk=challenged_player_id)
#    except (User.DoesNotExist):
#       raise Http404()

#    /match/propose?challenged_player_id=1&room_id=1&black_player_id=2&white_player_id=1&board_size=19&handicap=0&timed=true&main_time=30&byo_yomi=true

    print(request)
