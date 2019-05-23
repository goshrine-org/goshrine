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
            j = json.load(f)

            if isinstance(j, list):
                for game in json.load(f):
                    self.game_add(game)
            else:
                self.game_add(j)

    def game_add(self, game):
        print(f"Adding game {game['token']}.")
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

        # Work around a goshrine.com bug where timed=True and main_time=0
        # This creates an untimed game in practice.
        if timer['main_time'] == 0:
            timer['timed'] = False

        if timer['byo_yomi']:
            timer['byo_yomi_periods'] = game['byo_yomi_periods']
            timer['byo_yomi_seconds'] = game['byo_yomi_seconds']
            del(game['byo_yomi_periods'], game['byo_yomi_seconds'])

        del(game['timed'], game['main_time'], game['byo_yomi'],
            game['turn_started_at'], game['black_seconds_left'],
            game['white_seconds_left'])

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

        game['board_size'] = board['size']
        game['ko_pos']     = board['ko_pos']
        if game['ko_pos'] is None: game['ko_pos'] = ''
        if game['result'] is None: game['result'] = ''

        # Work around a bug: scoring data can be set for a resigned game.
        # This also sets the result to other than +R, which we do not accept.
        if game['resigned_by_id'] is not None:
            if game['black_player_id'] == game['resigned_by_id']:
                game['result'] = 'W+R'
            elif game['white_player_id'] == game['resigned_by_id']:
                game['result'] = 'B+R'
            else:
                raise RuntimeError('inconsistent data')

        with transaction.atomic():
#            game = Game.objects.create(**game)
            self.timer_add(game, timer)
            self.board_add(game, board)

    def timer_add(self, game, timer):
        if not timer['timed']: return
        del(timer['timed'])

        print(timer)
        input()

        # Workaround for negative times on goshrine.com
        if timer['black_seconds_left'] < 0:
            timer['black_seconds_left'] = 0
        if timer['white_seconds_left'] < 0:
            timer['white_seconds_left'] = 0

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
