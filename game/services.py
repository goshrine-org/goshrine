from django.forms.models import model_to_dict
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
