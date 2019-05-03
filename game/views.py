from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .forms import MatchCreateForm, MatchProposeForm
from django.core.validators import RegexValidator, ValidationError
from users.models import User
from rooms.models import Room, RoomChannel
from game.models import Game

def game(request, token):
    token_validator = RegexValidator("^[a-f0-9]+$")

    try:
        token_validator(token)
        game = Game.objects.get(token=token)
    except (ValidationError, User.DoesNotExist):
        # Original goshrine.com returns 'Game not found!' in plaintext
        raise Http404()

    return render(request, 'game/game.html', {'game': game})

def game_sgf(request, token):
    token_validator = RegexValidator("^[a-f0-9]+$")

    try:
        token_validator(token)
        game = Game.objects.get(token=token)
    except (ValidationError, User.DoesNotExist):
        # Original goshrine.com returns 'Game not found!' in plaintext
        raise Http404()

    res = HttpResponse(game.sgf(), content_type='application/x-go-sgf; charset=utf-8')
    return res

def game_for_eidogo(request, token):
    token_validator = RegexValidator("^[a-f0-9]+$")

    try:
        token_validator(token)
        game = Game.objects.get(token=token)
    except (ValidationError, User.DoesNotExist):
        # Original goshrine.com returns 'Game not found!' in plaintext
        raise Http404()

    s = {}
    s['dame']  = []
    s['white'] = []
    s['black'] = []
    s['dead_stones_by_color'] = { 'black': [], 'white': [] }
    s['score'] = model_to_dict(game.score, exclude=['id'])

    g = {}
    g['black_capture_count'] = game.black_capture_count
    g['black_player_id']     = game.black_player.id
    g['black_player_rank']   = game.black_player.rank
    g['black_seconds_left']  = game.black_seconds_left
    g['byo_yomi']            = game.byo_yomi
    g['finished_at']         = game.finished_at
    g['game_type']           = game.game_type
    g['handicap']            = game.handicap
    g['id']                  = game.board.id
    g['komi']                = game.komi
    g['last_move']           = game.last_move
    g['main_time']           = game.main_time
    g['match_request_id']    = 1 # XXX
    g['move_number']         = game.move_number
    g['resigned_by_id']      = game.resigned_by_id
    g['result']              = game.result
    g['room_id']             = game.room.id
    g['started_at']          = game.started_at
    g['state']               = game.state
    g['timed']               = game.timed
    g['token']               = game.token
    g['turn']                = game.turn
    g['turn_started_at']     = game.turn_started_at
    g['updated_at']          = game.updated_at
    if game.user_done_scoring is None:
        g['user_done_scoring'] = None
    else:
        g['user_done_scoring']   = game.user_done_scoring.id
    g['version']             = game.version
    g['white_capture_count'] = game.white_capture_count
    g['white_player_id']     = game.white_player.id
    g['white_player_rank']   = game.white_player.rank
    g['white_seconds_left']  = game.white_seconds_left
    g['scoring_info']        = s

    msg = {}
    msg['sgf'] = game.sgf()
    msg['game'] = g
    msg['allow_undo'] = True

    params = { 'separators': (',', ':') }
    return JsonResponse(msg, safe=False, json_dumps_params=params)

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

    room_id              = form.cleaned_data['room_id']
    challenged_player_id = form.cleaned_data['challenged_player_id']

    # Check if the room and the challenged player exist.  If not we simply
    # 404 at this time.
    # XXX: later can check if player is in the room.
    try:
        with transaction.atomic():
            room = Room.objects.get(pk=room_id)
            cp   = User.objects.get(pk=challenged_player_id)
    except (User.DoesNotExist, Room.DoesNotExist):
        raise Http404()

    # Send the challenge request to the room
    channel_layer = get_channel_layer()

    match_request = {
        'proposed_by_id': request.user.id
    }

    response = {
        'type'         : 'match_requested',
        'html'         : '<h1>kak</h1>',
        'game_token'   : 123,
        'match_request': match_request
    }

    # Relay the message to everyone in the group, including ourselves.
    async_to_sync(channel_layer.group_send)(
            f"room_{room_id}_user_{challenged_player_id}", {
                'type'   : 'room.xmit.event',
                'stream' : f'user_{challenged_player_id}',
                'payload': response
        }
    )

    # The response back to the client requesting the game.
    # 'errors' can be a list of messages like ['a', 'b']
    # 'result' is a good result
    response = {
        'result': f'A challenge has been sent to {cp.login}...'
    }

    params = { 'separators': (',', ':') }
    return JsonResponse(response, safe=False, json_dumps_params=params)

#    /match/propose?challenged_player_id=1&room_id=1&black_player_id=2&white_player_id=1&board_size=19&handicap=0&timed=true&main_time=30&byo_yomi=true

    print(request)
