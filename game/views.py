from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, Http404
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .forms import MatchCreateForm, MatchProposeForm
from django.core.validators import RegexValidator, ValidationError
from users.models import User
from rooms.models import Room, RoomChannel
from game.models import Board, Game, Move, Territory, MatchRequest
from django.utils import timezone

token_validator = RegexValidator("^[a-f0-9-]+$")

def game(request, token):
    try:
        token_validator(token)
        game = Game.objects.get(token=token)
    except (ValidationError, User.DoesNotExist):
        # Original goshrine.com returns 'Game not found!' in plaintext
        raise Http404()

    return render(request, 'game/game.html', {'game': game})

def game_sgf(request, token):
    try:
        token_validator(token)
        game = Game.objects.get(token=token)
    except (ValidationError, User.DoesNotExist):
        # Original goshrine.com returns 'Game not found!' in plaintext
        raise Http404()

    res = HttpResponse(game.sgf(), content_type='application/x-go-sgf; charset=utf-8')
    return res

def game_for_eidogo(request, token):
    try:
        token_validator(token)
        game = Game.objects.get(token=token)
    except (ValidationError, User.DoesNotExist):
        # Original goshrine.com returns 'Game not found!' in plaintext
        raise Http404()

    s = {}
    s['dame']  = Territory.objects.dame(game.board)
    s['white'] = Territory.objects.white(game.board)
    s['black'] = Territory.objects.black(game.board)
    s['dead_stones_by_color'] = { 'black': [], 'white': [] }

    if game.score:
        s['score'] = model_to_dict(game.score, exclude=['id'])

    g = {}
    g['black_capture_count'] = game.black_capture_count
    g['black_player_id']     = game.black_player.id
    g['black_player_rank']   = game.black_player_rank
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
    g['white_player_rank']   = game.white_player_rank
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
    black_player_id      = form.cleaned_data['black_player_id']
    white_player_id      = form.cleaned_data['white_player_id']
    board_size           = form.cleaned_data['board_size']
    handicap             = form.cleaned_data['handicap']
    timed                = form.cleaned_data['timed']
    main_time            = form.cleaned_data['main_time']
    byo_yomi             = form.cleaned_data['byo_yomi']

    # We cannot challenge ourself.
    if request.user.id == challenged_player_id:
        raise Http404()

    # The requesting user must be either black or white.
    if request.user.id not in (black_player_id, white_player_id):
        raise Http404()

    # Check if the room and the challenged player exist.  If not we simply
    # 404 at this time.
    # XXX: later can check if player is in the room.
    try:
        with transaction.atomic():
            room = Room.objects.get(pk=room_id)
            cp   = User.objects.get(pk=challenged_player_id)

            match_req = MatchRequest.objects.create(
                challenged_player_id=challenged_player_id,
                room_id=room_id,
                black_player_id=black_player_id,
                white_player_id=white_player_id,
                board_size=board_size,
                handicap=handicap,
                timed=timed,
                main_time=main_time,
                byo_yomi=byo_yomi
            )
    except (User.DoesNotExist, Room.DoesNotExist):
        raise Http404()

    # Send the challenge request to the room
    channel_layer = get_channel_layer()

    if request.user.id == black_player_id:
        color = 'white'
    else:
        color = 'black'

    game_info = '{}x{}'.format(board_size, board_size)
    if handicap != 0:
        game_info += f' with {handicap} handicap stones.'

    html  = "<p>A match was requested by {}.  You would play {} on {}.</p>"
    html += f'<button onclick="goshrine.acceptMatch({match_req.id})">Accept</button>'
    html += f'<button onclick="goshrine.rejectMatch({match_req.id})">Reject</button>'
    html = html.format(request.user.login, color, game_info)

    match_request = {
        'proposed_by_id': request.user.id
    }

    response = {
        'type'         : 'match_requested',
        'html'         : html,
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

def _game_create(match, black, white):
    byo_yomi_periods = None
    byo_yomi_seconds = None

    if match.timed:
        black_seconds_left = match.main_time * 60
        white_seconds_left = match.main_time * 60

        if match.byo_yomi:
            byo_yomi_periods   = 5
            byo_yomi_seconds   = 30
            black_seconds_left += byo_yomi_periods * byo_yomi_seconds
            white_seconds_left += byo_yomi_periods * byo_yomi_seconds
    else:
        black_seconds_left = None
        white_seconds_left = None

    with transaction.atomic():
        game = Game.objects.create(
            match_request=match,
            game_type='playervsplayer',
            handicap=match.handicap,
            timed=match.timed,
            main_time=match.main_time,
            byo_yomi=match.byo_yomi,
            room_id=match.room_id,
            white_player_rank=white.rank,
            black_player_rank=black.rank,
            black_player=black,
            white_player=white,
            black_seconds_left=black_seconds_left,
            white_seconds_left=white_seconds_left,
            byo_yomi_periods=byo_yomi_periods,
            byo_yomi_seconds=byo_yomi_seconds,
        )

        board = Board.objects.create(
            go_game=game,
            size=match.board_size,
            ko_pos=None
        )

    return game, board

@csrf_exempt
def match_accept(request, match_id):
    try:
        match = MatchRequest.objects.get(pk=match_id)
    except MatchRequest.DoesNotExist:
        raise Http404()

    # Ensure the specified match has us as the challenged player.
    if match.challenged_player_id != request.user.id:
        raise Http403()

    # Determine the user id of the challenger.
    if match.challenged_player_id == match.black_player_id:
        challenger_id = match.white_player_id
    else:
        challenger_id = match.black_player_id

    game, board = _game_create(match, match.black_player, match.white_player)

    response = {
        'type'      : 'match_accepted',
        'game_token': game.token,
    }

    # Relay the message to everyone in the group, including ourselves.
    channel_layer = get_channel_layer()
    print(f"    match_accepted/{game.token} -> room_{match.room_id}_user_{challenger_id}")
    async_to_sync(channel_layer.group_send)(
            f"room_{match.room_id}_user_{challenger_id}", {
                'type'   : 'room.xmit.event',
                'stream' : f'user_{challenger_id}',
                'payload': response
        }
    )

    return redirect(f'/g/{game.token}')

@csrf_exempt
def move(request, token, coord):
    if len(coord) > 2 and coord != 'pass':
        return HttpResponseBadRequest()

    try:
        token_validator(token)

        with transaction.atomic():
            game = Game.objects.get(token=token)

            if game.turn == 'b':
                if game.black_player_id != request.user.id:
                    raise Http403()
                game.turn = 'w'
            elif game.turn == 'w':
                if game.white_player_id != request.user.id:
                    raise Http403()
                game.turn = 'b'

            Move.objects.create(game=game, number=game.move_number, coordinate=coord)
            game.move_number += 1
            game.version += 1
            game.last_move = coord
            game.updated_at = timezone.now()
            game.save(update_fields=['turn', 'move_number', 'version', 'last_move', 'updated_at'])
    except (ValidationError, Game.DoesNotExist):
        raise Http404()

    channel_layer = get_channel_layer()
    response = {
        'action': 'updateBoard',
        'data'  : {
            'version'           : game.version,
            'move'              : game.last_move,
            'black_seconds_left': game.black_seconds_left,
            'white_seconds_left': game.white_seconds_left
        }
    }

    group = f'game_{game.token}'
    print(f"    game_started -> {group}")
    async_to_sync(channel_layer.group_send)(
            group, {
                'type'   : 'room.xmit.event',
                'stream' : f'game_play_{game.token}',
                'payload': response
        }
    )

    params = { 'separators': (',', ':') }
    return JsonResponse({}, safe=False, json_dumps_params=params)

@csrf_exempt
def attempt_start(request, token):
    if request.method != 'POST':
        raise Http404()

    try:
        token_validator(token)

        with transaction.atomic():
            fields = []
            game   = Game.objects.get(token=token)

            if game.black_player_id == request.user.id:
                game.black_seen = True
                fields.append("black_seen")
            elif game.white_player_id == request.user.id:
                game.white_seen = True
                fields.append("white_seen")

            if game.black_seen and game.white_seen:
                game.state = 'in-play'
                fields.append("state")

            game.save(update_fields=fields)
    except (ValidationError, Game.DoesNotExist):
        raise Http404()

    if not(game.black_seen and game.white_seen):
        return HttpResponse('')

    channel_layer = get_channel_layer()
    response = {
        'action': 'game_started'
    }

    group = f'game_{game.token}'
    print(f"    game_started -> {group}")
    async_to_sync(channel_layer.group_send)(
            group, {
                'type'   : 'room.xmit.event',
                'stream' : f'game_play_{game.token}',
                'payload': response
        }
    )

    return HttpResponse('')
