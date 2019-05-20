from django.db import transaction
from django.utils import timezone
from django.forms.models import model_to_dict
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import DeadStones, Score, Territory, Timer

def game_scoreinfo(game):
    # Fill in the territory in the scoreinfo dict.
    territory = Territory.objects.get(game_id=game.id)
    scoreinfo = model_to_dict(territory, exclude=['id', 'game'])

    # Fill in the deadstones we have.
    deadstones = DeadStones.objects.get(game_id=game.id)
    scoreinfo['dead_stones_by_color'] = model_to_dict(deadstones, exclude=['id', 'game'])

    # Finally fill in the score.
    scoreinfo['score'] = model_to_dict(game.score, exclude='id')

    return scoreinfo

def game_broadcast(game_token, stream, msg):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'game_{game_token}', {
            'type'   : 'room.xmit.event',
            'stream' : stream,
            'payload': msg
        }
    )

def game_broadcast_play(game_token, msg):
    return game_broadcast(game_token, f'game_play_{game_token}', msg)

def game_broadcast_chat(game_token, msg):
    return game_broadcast(game_token, f'game_chat_{game_token}', msg)

def game_broadcast_resign(game_token, result):
    response = {
        'action': 'resignedBy',
        'data'  : {
            'result': result
        }
    }
    game_broadcast_play(game_token, response)

def game_broadcast_scoring(game_token, scoreinfo):
    response = {
        'action': 'setScoring',
        'data'  : scoreinfo
    }
    game_broadcast_play(game_token, response)

def game_broadcast_finished(game_token, result, scoreinfo=None, black_time=None, white_time=None):
    response = {
	'action': 'gameFinished',
	'data'  : {
	    'result'            : result,
	    'scoring_info'      : scoreinfo,
	    'black_seconds_left': black_time,
	    'white_seconds_left': white_time
	}
    }
    game_broadcast_play(game_token, response)

def room_user_send(room_id, user_id, msg):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"room_{room_id}_user_{user_id}", {
            'type'   : 'room.xmit.event',
            'stream' : f'user_{user_id}',
            'payload': msg
        }
    )

def game_finish_timeout(game, clock):
    if clock.black_seconds_left == 0: result = 'W+T'
    elif clock.white_seconds_left == 0: result = 'B+T'

    game.state      = 'finished'
    game.updated_at = timezone.now()
    game.result     = result
    game.save(update_fields=['result', 'state', 'updated_at'])

    # Tell everyone in the broadcast group the result.
    transaction.on_commit(game_broadcast_finished(
	game.token,
	result,
	black_time=clock.black_seconds_left,
	white_time=clock.white_seconds_left
    ))

def game_seconds_left(clock, left, elapsed):
    # First we check for clock expiration
    if left <= elapsed:
        return 0

    # No byo-yomi means we can just return real elapsed time/
    if not clock.byo_yomi:
        return left - elapsed

    # Elapsed time doesn't put us in byo-yomi yet.
    byo_yomi_threshold = clock.byo_yomi_periods * clock.byo_yomi_seconds
    left -= elapsed
    if left >= byo_yomi_threshold:
        return left

    # Clean division with no remainder and we're done.
    rem = left % clock.byo_yomi_seconds
    if rem == 0:
        return left

    # We round what is left up to the next byo yomi period.
    return left + (clock.byo_yomi_seconds - rem)

def game_clock_update(game, move=False):
    if game.state != 'in-play':
        return None

    try:
        with transaction.atomic():
            clock   = Timer.objects.select_for_update().get(game_id=game.id)
            now     = timezone.now()
            elapsed = now - clock.updated_at
            elapsed = int(elapsed.total_seconds())

            if game.turn == 'b':
                left = game_seconds_left(clock, clock.black_seconds_left, elapsed)
                if left <= 0:
                    game_finish_timeout(game, clock)
                elif move:
                    clock.black_seconds_left = left
            elif game.turn == 'w':
                left = game_seconds_left(clock, clock.white_seconds_left, elapsed)
                if left <= 0:
                    game_finish_timeout(game, clock)
                elif move:
                    clock.white_seconds_left = left

            # We only update the clock when a move has actually been made.
            # This dampens database activity a bit, and is in line with the
            # original goshrine.com javascript.
            if move:
                clock.updated_at = now

            # XXX: can be optimized.  Not always necessary.
            clock.save()
    except Timer.DoesNotExist:
        return None

    return clock
