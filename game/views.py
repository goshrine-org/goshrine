from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse, Http404
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.db import transaction
from .forms import MatchCreateForm, MatchProposeForm, MessageForm
from django.core.validators import RegexValidator, ValidationError
from users.models import User
from rooms.models import Room, RoomChannel
from game.models import Board, Game, Move, Territory, MatchRequest, Message, DeadStones, Score
from django.utils import timezone
from .algorithm import Board as BoardSimulator, InvalidMoveError
from datetime import timedelta
from .services import *

token_validator = RegexValidator("^[a-f0-9-]+$")

def json_response(msg, **kwargs):
    params = { 'separators': (',', ':') }
    return JsonResponse(msg, safe=False, json_dumps_params=params, **kwargs)

def json_error(msg, **kwargs):
    data = { 'error': msg }
    return json_response(data)

def game(request, token):
    with transaction.atomic():
        game  = get_object_or_404(Game.objects.select_for_update(), token=token)
        clock = game_clock_update(game)
    return render(request, 'game/game.html', {'game': game, 'clock': clock})

# Validate whether the requested 'user_id' is playing this game.
def game_validate_user(game, user_id):
    if game.black_player_id == user_id:
        return True
    if game.white_player_id == user_id:
        return True
    return False

def game_sgf(request, token):
    with transaction.atomic():
        game = get_object_or_404(Game.objects.select_for_update(), token=token)
        game_clock_update(game)
    return HttpResponse(game.sgf(), content_type='application/x-go-sgf; charset=utf-8')

def game_for_eidogo(request, token):
    with transaction.atomic():
        game  = get_object_or_404(Game.objects.select_for_update(), token=token)
        clock = game_clock_update(game)

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

    # Fill in timer information.
    if clock is not None:
        g['black_seconds_left']  = clock.black_seconds_left
        g['white_seconds_left']  = clock.white_seconds_left
        g['byo_yomi']            = clock.byo_yomi
        g['main_time']           = clock.main_time
        g['timed']               = True
        g['turn_started_at']     = clock.updated_at.strftime('%Y-%m-%dT%H:%M:%SZ')
    else:
        g['timed']               = False

    if game.state != 'finished':
        g['finished_at']     = None
    else:
        g['finished_at']     = game.updated_at.strftime('%Y-%m-%d')

    g['game_type']           = game.game_type
    g['handicap']            = game.handicap
    g['id']                  = game.board.id
    g['komi']                = game.komi
    g['last_move']           = game.last_move
    g['match_request_id']    = game.match_request_id
    g['move_number']         = game.move_number
    g['resigned_by_id']      = game.resigned_by_id
    g['result']              = game.result
    g['room_id']             = game.room.id
    g['started_at']          = game.started_at
    g['state']               = game.state
    g['token']               = game.token
    g['turn']                = game.turn

    g['updated_at']          = game.updated_at
    if game.user_done_scoring is None:
        g['user_done_scoring'] = None
    else:
        g['user_done_scoring']   = game.user_done_scoring.id
    g['version']             = game.version
    g['white_capture_count'] = game.white_capture_count
    g['white_player_id']     = game.white_player.id
    g['white_player_rank']   = game.white_player_rank
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

    # Send a match request to specified user in the specified room.
    response = {
        'type'         : 'match_requested',
        'html'         : html,
        'match_request': { 'proposed_by_id': request.user.id }
    }
    room_user_send(room_id, challenged_player_id, response)

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
            room_id=match.room_id,
            white_player_rank=white.rank,
            black_player_rank=black.rank,
            black_player=black,
            white_player=white,
        )

        board = Board.objects.create(
            go_game=game,
            size=match.board_size,
            ko_pos=None
        )

        if match.timed:
            timer = Timer.objects.create(
                game=game,
                main_time=match.main_time,
                byo_yomi=match.byo_yomi,
                byo_yomi_periods=byo_yomi_periods,
                byo_yomi_seconds=byo_yomi_seconds,
                black_seconds_left=black_seconds_left,
                white_seconds_left=white_seconds_left
        )

    return game, board

@csrf_exempt
def match_accept(request, match_id):
    # We have to ensure the game is not accepted twice.  We lock the relevant
    # MatchRequest row/object with select_for_update and do not release it
    # until after we have made a game referencing it.
    with transaction.atomic():
        match = get_object_or_404(MatchRequest.objects.select_for_update(), pk=match_id)

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

    # Send the challenge reply to the specified user in the specified room.
    print(f"    match_accepted/{game.token} -> room_{match.room_id}_user_{challenger_id}")
    response = {
        'type'      : 'match_accepted',
        'game_token': game.token,
    }
    room_user_send(match.room_id, challenger_id, response)

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

def score_update(game, score, board):
    # Calculate the score.
    score['score'] = {}
    score['score']['black_territory_count']  = len(score['black'])
    score['score']['black_territory_count'] += len(score['dead_stones_by_color']['white'])
    score['score']['white_territory_count']  = len(score['white'])
    score['score']['white_territory_count'] += len(score['dead_stones_by_color']['black'])
    score['score']['black'] = score['score']['black_territory_count'] + board.captures['b']
    score['score']['white'] = score['score']['white_territory_count'] + board.captures['w'] + float(game.komi)

    with transaction.atomic():
        game = Game.objects.select_for_update().get(token=game.token)
        game.state = 'scoring'
        game.score = Score.objects.get_or_create(**score['score'])[0]
        # We use update or create, as there could be pending DeadStones
        # set during a previous estimation which was undone.
        dead = DeadStones.objects.update_or_create(
            game=game,
            defaults={
                'black': score['dead_stones_by_color']['black'],
                'white': score['dead_stones_by_color']['white']
            }
        )
        territory = Territory.objects.update_or_create(
            game=game,
            defaults={
                'black': score['black'],
                'white': score['white'],
                'dame' : score['dame']
            }
        )
        game.save()

    # XXX: kludge due to old goshrine javascript
    if score['dame'] : score['dame']  = [score['dame']]
    if score['black']: score['black'] = [score['black']]
    if score['white']: score['white'] = [score['white']]

    print(score)
    game_broadcast_scoring(game.token, score)

@csrf_exempt
def done_scoring(request, token):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    with transaction.atomic():
        game = get_object_or_404(Game.objects.select_for_update(), token=token)

        if not game_validate_user(game, request.user.id):
            return HttpResponseForbidden()

        if game.state != 'scoring':
            return HttpResponseForbidden()

        if game.user_done_scoring is not None:
            # If we signal we're done scoring twice, we do not count.
            if game.user_done_scoring_id == request.user.id:
                return HttpResponseForbidden()

            # Totally done scoring.
            game.state               = 'finished'
            game.black_capture_count = len(game.dead_stones_by_color.white)
            game.white_capture_count = len(game.dead_stones_by_color.black)
            game.updated_at          = timezone.now()
            game.result              = game.score.result()
            game.save()

            # Tell everyone in the broadcast group the result.
            game_broadcast_finished(
                game.token,
                game.result,
                game_scoreinfo(game),
                0, #game.black_seconds_left,
                0 #game.white_seconds_left
            )
            return json_response({})

        # We are the first to be done with scoring.  Flag it.
        game.user_done_scoring_id = request.user.id
        game.save()

    return json_response({})

@csrf_exempt
def mark_group_dead(request, token, coord):
    if len(coord) > 2:
        return HttpResponseBadRequest()

    with transaction.atomic():
        game = get_object_or_404(Game.objects, token=token)

        if not game_validate_user(game, request.user.id):
            return HttpResponseForbidden()

        if game.state != 'scoring':
            return json_error('game is not being scored')

    # We work with groups here, so we first reconstruct the board.
    board = board_simulate(game)

    print(board)
    group = board.group(board.translate(coord))

    # The group will be empty if there is no stone.  We're done.
    if not group:
        return json_error('there is no stone here')

    color = board.get(board.translate(coord))
    if color == 'b':
        dead_stones = game.dead_stones_by_color.black
    else:
        dead_stones = game.dead_stones_by_color.white

    # Merge our list of dead stones and remove them from the board.
    group           = set(board.coords_to_gs(group))
    new_dead_stones = list(group | set(dead_stones))

    print('REMOVING:', new_dead_stones)
    for stone in new_dead_stones:
        board.remove(board.translate(stone))

    print(board)
    score = board.pachi_evaluate()

    if color == 'b':
        game.dead_stones_by_color.black = new_dead_stones
        s  = set(score['dead_stones_by_color']['black'])
        s |= set(new_dead_stones)
        score['dead_stones_by_color']['black'] = list(s)
    else:
        game.dead_stones_by_color.white = new_dead_stones
        s  = set(score['dead_stones_by_color']['white'])
        s |= set(new_dead_stones)
        score['dead_stones_by_color']['white'] = list(s)

    score_update(game, score, board)
    return json_response({})


@csrf_exempt
def move(request, token, coord):
    if len(coord) > 2 and coord != 'pass':
        return HttpResponseBadRequest()

    game_end = False

    # Hold a row lock on 'game' until we have created a a new move and
    # updated the relevant game data.
    with transaction.atomic():
        fields = ['turn', 'turn_started_at', 'move_number', 'version', 'last_move', 'updated_at']
        game   = get_object_or_404(Game.objects.select_for_update(), token=token)
        clock  = game_clock_update(game, move=True)

        if not game_validate_user(game, request.user.id):
            return HttpResponseForbidden()

        if game.state != 'in-play':
            return HttpResponseForbidden()

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
        game.turn_started_at = clock.updated_at
        game.save(update_fields=fields)

    response = {
        'action': 'updateBoard',
        'data'  : {
            'version'           : game.version,
            'move'              : game.last_move,
            'black_seconds_left': clock.black_seconds_left,
            'white_seconds_left': clock.white_seconds_left,
            'turn_started_at'   : clock.updated_at.strftime('%Y-%m-%dT%H:%M:%SZ')
        }
    }
    game_broadcast_play(game.token, response)

    if game_end:
        game_broadcast_play(game.token, { 'action': 'estimatingScore' })
        score = board.pachi_evaluate()
        score_update(game, score, board)

    return json_response({})

@csrf_exempt
def attempt_start(request, token):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    # We will modify the game row, so we hold a transactional lock on it.
    with transaction.atomic():
        fields = []
        game   = get_object_or_404(Game.objects.select_for_update(), token=token)

        if not game_validate_user(game, request.user.id):
            return HttpResponseForbidden()

        if game.black_player_id == request.user.id:
            game.black_seen = True
            fields.append("black_seen")
        elif game.white_player_id == request.user.id:
            game.white_seen = True
            fields.append("white_seen")

        if game.state != 'new':
            return HttpResponseForbidden()

        if game.black_seen and game.white_seen:
            game.started_at = timezone.now()
            game.state      = 'in-play'
            fields += "started_at", "state"

        game.save(update_fields=fields)

    if not(game.black_seen and game.white_seen):
        return HttpResponse('')

    game_broadcast_play(game.token, { 'action': 'game_started' })
    return HttpResponse('')

@csrf_exempt
def resign(request, token):
    try:
        token_validator(token)

        Game.objects.filter(token=token).resign(request.user.id)
    except (ValidationError, Game.DoesNotExist):
        raise Http404()

    game = Game.objects.get(token=token)
    game_broadcast_resign(game.token, game.result)
    return json_response({})

@csrf_exempt
def messages(request, token):
    game     = get_object_or_404(Game.objects.only('token'), token=token)
    messages = Message.objects.filter(game_id=game.id).select_related('user').order_by('created_at')

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

    game = get_object_or_404(Game.objects.only('token'), token=token)
    msg  = Message.objects.create(text=message, user_id=request.user.id, game_id=game.id)

    response = {  
        'msg'   : {
            'created_at': msg.created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
            'user'      : msg.user.login,
            'text'      : msg.text
        }
    }   
    game_broadcast_chat(token, response)

    return json_response({})

@csrf_exempt
def time_elapsed(request, token):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    with transaction.atomic():
        game  = get_object_or_404(Game.objects.select_for_update(), token=token)
        clock = game_clock_update(game)

    return json_response({})
