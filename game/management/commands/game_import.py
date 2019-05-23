import json
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from game.models import *
from users.models import User

class Command(BaseCommand):
    help = 'Import a goshrine.com json game into the database.'

    def add_arguments(self, parser):
        parser.add_argument('pathnames', nargs='+')

    def handle(self, *args, **options):
        for pathname in options['pathnames']:
            self.handle_file(pathname)
            self.stdout.write(self.style.SUCCESS(pathname))

    def handle_file(self, pathname):
        with open(pathname, 'r') as f:
            self.game_add(json.load(f))

    def game_add(self, game):
        if 'board' not in game or not game['board']:
            raise CommandError(f'No board defined in game')

        board = game['board']
        score = game['score']

        timer = {
            'timed': game['timed'],
            'main_time': game['main_time'],
            'byo_yomi': game['byo_yomi'],
            'updated_at': game['turn_started_at'],
            'black_seconds_left': game['black_seconds_left'],
            'white_seconds_left': game['white_seconds_left']
        }
        if timer['timed'] is None: timer['timed'] = False
        if timer['byo_yomi'] is None: timer['byo_yomi'] = False

        if timer['byo_yomi']:
            timer['byo_yomi_periods'] = game['byo_yomi_periods']
            timer['byo_yomi_seconds'] = game['byo_yomi_seconds']
            del(game['byo_yomi_periods'], game['byo_yomi_seconds'])

        del(game['timed'], game['main_time'], game['byo_yomi'],
            game['turn_started_at'], game['black_seconds_left'],
            game['white_seconds_left'])

#        handicap_stones = game['handicap_stones']
#        if handicap_stones is None: handicap_stones = []
        del(game['board'], game['score'])
        del(game['white_player'], game['black_player'])
        del(game['subscribed_users'], game['board_size'])
        del(game['finished_at'])

        game['match_request_id'] = None

        if game['user_done_scoring'] is not None:
            game['user_done_scoring_id'] = int(game['user_done_scoring'])
            del(game['user_done_scoring'])

        # If there is a score, create or get it first, and add it back to
        # the game definition.
        if score:
            game['score'], created = self.score_add(score)
            print(f"game score: {game['score']}")

        game['board_size'] = board['size']
        game['ko_pos']     = board['ko_pos']
        if game['ko_pos'] is None: game['ko_pos'] = ''
        if game['result'] is None: game['result'] = ''

        with transaction.atomic():
            game = Game.objects.create(**game)
            self.timer_add(game, timer)
            self.board_add(game, board)

    def timer_add(self, game, timer):
        if not timer['timed']: return
        del(timer['timed'])

        Timer.objects.create(
            game=game,
            **timer
        )

    def board_add(self, game, board):
        stones      = board['stones']
        territories = board['territories']
        dead_stones = board['dead_stones_by_color']

        self.territories_add(game, territories)
        self.dead_stones_add(game, dead_stones)

    def flatten(self, l):
        return [item for sublist in l for item in sublist]

    def territories_add(self, game, territories):
        Territory.objects.create(
            game=game,
            black=self.flatten(territories['black']),
            white=self.flatten(territories['white']),
            dame=self.flatten(territories['dame'])
        )

    def dead_stones_add(self, game, dead_stones):
        DeadStones.objects.create(
            game=game,
            black=dead_stones['black'],
            white=dead_stones['white']
        )

    def score_add(self, score):
        return Score.objects.get_or_create(**score)
