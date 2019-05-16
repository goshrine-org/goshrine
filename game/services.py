from django.forms.models import model_to_dict
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import DeadStones, Score, Territory

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

def game_broadcast_finished(game_token, result, scoreinfo, black_time, white_time):
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
