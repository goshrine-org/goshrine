from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse, Http404
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .forms import MatchCreateForm, MatchProposeForm, MessageForm
from django.core.validators import RegexValidator, ValidationError
from users.models import User
from rooms.models import Room, RoomChannel
from game.models import Board, Game, Move, Territory, MatchRequest, Message, DeadStones
from django.utils import timezone
from .algorithm import Board as BoardSimulator, InvalidMoveError
from datetime import timedelta

token_validator = RegexValidator("^[a-f0-9-]+$")

def json_response(msg, **kwargs):
    params = { 'separators': (',', ':') }
    return JsonResponse(msg, safe=False, json_dumps_params=params, **kwargs)

def json_error(msg, **kwargs):
    data = { 'error': msg }
    return json_response(data)

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

    s = { 'dead_stones_by_color': {} }
    try:
        s['dame']  = [game.territory.dame]
        s['white'] = [game.territory.white]
        s['black'] = [game.territory.black]
    except Game.territory.RelatedObjectDoesNotExist:
        s['dame'] = s['black'] = s['white'] = []

    try:
        s['dead_stones_by_color']['black'] = game.dead_stones_by_color.black
        s['dead_stones_by_color']['white'] = game.dead_stones_by_color.white
    except Game.dead_stones_by_color.RelatedObjectDoesNotExist:
        s['dead_stones_by_color']['black'] = []
        s['dead_stones_by_color']['white'] = []

    if game.score:
        s['score'] = model_to_dict(game.score, exclude=['id'])

    g = {}
    g['black_capture_count'] = game.black_capture_count
    g['black_player_id']     = game.black_player.id
    g['black_player_rank']   = game.black_player_rank
    g['black_seconds_left']  = game.black_seconds_left
    g['byo_yomi']            = game.byo_yomi
    if game.state != 'finished':
        g['finished_at']     = None
    else:
        g['finished_at']     = game.updated_at.strftime('%Y-%m-%d')
    g['game_type']           = game.game_type
    g['handicap']            = game.handicap
    g['id']                  = game.board.id
    g['komi']                = game.komi
    g['last_move']           = game.last_move
    g['main_time']           = game.main_time
    g['match_request_id']    = game.match_request_id
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

    return json_response(msg)

# XXX: called by application.js shit.  Later we need to set the CSRF
# cookie.
# https://stackoverflow.com/questions/6506897/csrf-token-missing-or-incorrect-while-post-parameter-via-ajax-in-django
@csrf_exempt
def match_create(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    form = MatchCreateForm(request.POST)
    if not form.is_valid():
        raise Http404()

    target_user_id = form.cleaned_data['challenged_player_id']
    room_id        = form.cleaned_data['room_id']

    try:
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
        return HttpResponseNotAllowed(['GET'])

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

    return json_response(response)

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

    # We have to ensure the game is not accepted twice.  We lock the relevant
    # MatchRequest row/object with select_for_update and do not release it
    # until after we have made a game referencing it.
    with transaction.atomic():
        try:
            match = MatchRequest.objects.select_for_update().get(pk=match_id)
        except MatchRequest.DoesNotExist:
            raise Http404()

        try:
            game = match.game
        except MatchRequest.game.RelatedObjectDoesNotExist:
            # We can only accept a match request if there is no associated game
            # for it in the database.
            pass
        else:
            return HttpResponseForbidden('Game has been accepted in the past.')

        if timezone.now() > match.created_at + timedelta(seconds=60):
            return HttpResponseForbidden('Match request expired.')

        # Ensure the specified match has us as the challenged player.
        if match.challenged_player_id != request.user.id:
            return HttpResponseForbidden('Match was not proposed to us.')

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

def board_simulate(game, coord=None):
    board = BoardSimulator(game.board.size)

    # Reconstruct the board until the current move.
    for move in game.moves.all().order_by('number'):
        if move.coordinate == 'pass':
            pos = None
        else:
            pos = board.translate(move.coordinate)
        board.move(pos)

    if coord is None:
        return board

    if coord == 'pass':
        pos = None
    else:
        pos = board.translate(coord)
    board.move(pos)

    print(board)
    return board

@csrf_exempt
def mark_group_dead(request, token, coord):
    if len(coord) > 2:
        return HttpResponseBadRequest()

    try:
        token_validator(token)

        with transaction.atomic():
            game = Game.objects.get(token=token)

            if game.state != 'scoring':
                return json_error('game is still in progress')

            print(game.dead_stones_by_color.white)
    except (ValidationError, Game.DoesNotExist):
        raise Http404()

    # We work with groups here, so we first reconstruct the board.
    board = board_simulate(game)

    for s in board.gtp():
        print(s)
    print(board)
    print(board.pachi_evaluate())
#    group = board.group(board.translate(coord))

    # The group will be empty if there is no stone.  We're done.
    if not group:
        return json_error('there is no stone here')

#    sgf_coord = board.translate(coord)
#    group = board.group(sgf_coord)

    channel_layer = get_channel_layer()
    response = {
        'action': 'setScoring',
        'data'  : {
            'white': [],
            'black': [],
            'dame' : [],
            'dead_stones_by_color': {
                'black': [],
                'white': []
            }
        }
    }

    group = f'game_{game.token}'
    print(f"    setScoring -> {group}")
    async_to_sync(channel_layer.group_send)(
            group, {
                'type'   : 'room.xmit.event',
                'stream' : f'game_play_{game.token}',
                'payload': response
        }
    )

    return json_response({})

@csrf_exempt
def move(request, token, coord):
    if len(coord) > 2 and coord != 'pass':
        return HttpResponseBadRequest()

    game_end = False
    try:
        token_validator(token)

        # Hold a row lock on 'game' until we have created a a new move and
        # updated the relevant game data.
        with transaction.atomic():
            fields = ['turn', 'move_number', 'version', 'last_move', 'updated_at']
            game = Game.objects.select_for_update().get(token=token)

            if game.state != 'in-play':
                return json_response({})

            if game.turn == 'b':
                if game.black_player_id != request.user.id:
                    msg = "It's not your turn!"
                    return json_response({'error': msg})
                game.turn = 'w'
            elif game.turn == 'w':
                if game.white_player_id != request.user.id:
                    msg = "It's not your turn!"
                    return json_response({'error': msg})
                game.turn = 'b'

            if game.last_move == 'pass' and coord == 'pass':
                game_end = True
                game.state = 'estimating-score'
                fields.append('state')

            try:
                board = board_simulate(game, coord)
            except InvalidMoveError as e:
                return json_response({'error': str(e)})

            Move.objects.create(game=game, number=game.move_number, coordinate=coord)
            game.move_number += 1
            game.version     += 1
            game.last_move    = coord
            game.updated_at   = timezone.now()
            game.save(update_fields=fields)
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
    print(f"    updateBoard -> {group}")
    async_to_sync(channel_layer.group_send)(
            group, {
                'type'   : 'room.xmit.event',
                'stream' : f'game_play_{game.token}',
                'payload': response
        }
    )

    if game_end:
        response = {
            'action': 'estimatingScore',
        }

        group = f'game_{game.token}'
        print(f"    estimatingScore -> {group}")
        async_to_sync(channel_layer.group_send)(
                group, {
                    'type'   : 'room.xmit.event',
                    'stream' : f'game_play_{game.token}',
                    'payload': response
            }
        )

        score = board.pachi_evaluate()

        with transaction.atomic():
            game = Game.objects.select_for_update().get(token=token)
            game.state = 'scoring'
            # We use update or create, as there could be pending DeadStones
            # set during a previous estimation which was undone.
            dead = DeadStones.objects.update_or_create(
                game=game,
                black=score['dead_stones_by_color']['black'],
                white=score['dead_stones_by_color']['white']
            )
            territory = Territory.objects.update_or_create(
                game=game,
                black=score['black'],
                white=score['white']
            )
            game.save()

        # XXX: kludge due to old goshrine javascript
        if score['dame'] : score['dame']  = [score['dame']]
        if score['black']: score['black'] = [score['black']]
        if score['white']: score['white'] = [score['white']]
        print(score)
        response = {
            'action': 'setScoring',
            'data'  : score
        }
        group = f'game_{game.token}'
        print(f"    setScoring -> {group}")
        async_to_sync(channel_layer.group_send)(
                group, {
                    'type'   : 'room.xmit.event',
                    'stream' : f'game_play_{game.token}',
                    'payload': response
            }
        )

    return json_response({})

@csrf_exempt
def attempt_start(request, token):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    try:
        token_validator(token)

        # We will modify the game row, so we hold a transactional lock on it.
        with transaction.atomic():
            fields = []
            game   = Game.objects.select_for_update().get(token=token)

            if game.black_player_id == request.user.id:
                game.black_seen = True
                fields.append("black_seen")
            elif game.white_player_id == request.user.id:
                game.white_seen = True
                fields.append("white_seen")
            else:
                return HttpResponseForbidden()

            if game.state != 'new':
                return HttpResponseForbidden()

            if game.black_seen and game.white_seen:
                game.started_at = timezone.now()
                game.state      = 'in-play'
                fields += "started_at", "state"

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

@csrf_exempt
def resign(request, token):
    try:
        token_validator(token)

        with transaction.atomic():
            game = Game.objects.select_for_update().get(token=token)

            if game.state != 'in-play':
                return HttpResponseForbidden()

            game.state          = 'finished'
            game.resigned_by_id = request.user.id
            game.updated_at     = timezone.now()

            if game.black_player_id == request.user.id:
                game.result = "W+R"
            elif game.white_player_id == request.user.id:
                game.result = "B+R"
            else:
                return HttpResponseForbidden()

            game.save(update_fields=['state', 'resigned_by_id', 'updated_at', 'result'])
    except (ValidationError, Game.DoesNotExist):
        raise Http404()

    channel_layer = get_channel_layer()
    response = {
        'action': 'resignedBy',
        'data'  : {
            'result': game.result
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

    return json_response({})

@csrf_exempt
def messages(request, token):
    try:
        token_validator(token)
        game     = Game.objects.only('token').get(token=token)
        messages = Message.objects.filter(game_id=game.id).select_related('user').order_by('created_at')
    except (ValidationError, Game.DoesNotExist):
        raise Http404()

    json_messages = []
    for m in messages:
        d = {
            'created_at': m.created_at,
            'text'      : m.text,
            'user'      : m.user.login,
            'user_id'   : m.user.id
        }
        json_messages.append(d)

    return json_response(json_messages)

@csrf_exempt
def chat(request, token):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    form = MessageForm(request.POST)
    if not form.is_valid():
        return HttpResponseBadRequest(form.errors.as_json(),
                                      content_type='application/json')

    message = form.cleaned_data['text']

    try:
        token_validator(token)
        game = Game.objects.only('token').get(token=token)
    except (ValidationError, Game.DoesNotExist):
        raise Http404()

    msg = Message.objects.create(text=message, user_id=request.user.id, game_id=game.id)

    response = {  
	'msg'   : {
	    'created_at': msg.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
	    'user'      : msg.user.login,
	    'text'      : msg.text
	}
    }   

    # Relay the message to everyone in the group, including ourselves.
    group         = f'game_{token}'
    stream        = f'game_chat_{token}'
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(group, {
	'type'   : 'room.xmit.event',
	'stream' : stream,
	'payload': response
    })  
    print(f'chat -> {group}')

    return json_response({})
