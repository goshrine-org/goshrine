import json
from django.core.management.base import BaseCommand, CommandError
from game.models import *
from users.models import User

class Command(BaseCommand):
    help = 'Import a goshrine.com json game into the database.'

    def add_arguments(self, parser):
        parser.add_argument('pathnames', nargs='+')

    def handle(self, *args, **options):
        for pathname in options['pathnames']:
#            try:
#                poll = Poll.objects.get(pk=poll_id)
#            except Poll.DoesNotExist:
#                raise CommandError('Poll "%s" does not exist' % poll_id)

#            poll.opened = False
#            poll.save()

            self.handle_file(pathname)
            self.stdout.write(self.style.SUCCESS(pathname))

    def handle_file(self, pathname):
        with open(pathname, 'r') as f:
            self.game_add(json.load(f))

    def game_add(self, game):
        if 'board' not in game or not game['board']:
            raise CommandError(f'No board defined in game')

        board = game['board']
        moves = game['moves']
        score = game['score']
        handicap_stones = game['handicap_stones']
        del(game['board'], game['moves'], game['score'])
        del(game['handicap_stones'], game['white_player'], game['black_player'])
        del(game['subscribed_users'], game['board_size'])

        game['match_request_id'] = None

        if game['timed'] is None: game['timed'] = False
        if game['user_done_scoring'] is not None:
            game['user_done_scoring_id'] = int(game['user_done_scoring'])
            del(game['user_done_scoring'])

        # If there is a score, create or get it first, and add it back to
        # the game definition.
        if score:
            game['score'], created = self.score_add(score)
            print(f"game score: {game['score']}")

        # First we create the game definition in the database.
        game = Game.objects.create(**game)

        # Then we add the rest.
        self.board_add(game, board)
        self.moves_add(game, moves)
        self.handicap_stones_add(game, handicap_stones)

    def moves_add(self, game, moves):
        for i, move in enumerate(moves):
            Move.objects.create(**{
                'game'      : game,
                'number'    : i,
                'coordinate': move
            })

    def handicap_stones_add(self, game, handicap_stones):
        for coord in handicap_stones:
            HandicapStone.objects.create(**{
                'game'      : game,
                'coordinate': coord
            })

    def board_add(self, game, board):
        stones      = board['stones']
        territories = board['territories']
        dead_stones = board['dead_stones_by_color']

        board = Board.objects.create(**{
            'id'     : board['id'],
            'go_game': game,
            'size'   : board['size'],
            'ko_pos' : board['ko_pos']
        })

        # Now that we have the board, add all the stones to it.
        self.stones_add(board, stones)
        self.territories_add(board, territories)
        self.dead_stones_add(board, dead_stones)

    def stones_add(self, board, stones):
        for i, color in enumerate(stones):
            stone = {
                'board': board,
                'index': i,
		'color': color
	    }

            if stone['color'] == 'null': stone['color'] = None
            Stone.objects.create(**stone)

    def territories_add(self, board, territories):
        for i, territory in enumerate(territories['black']):
            t = Territory.objects.create(board=board, index=i)

            for coord in territory:
                TerritoryBlack.objects.create(territory=t, coordinate=coord)

        for i, territory in enumerate(territories['white']):
            t = Territory.objects.create(board=board, index=i)

            for coord in territory:
                TerritoryWhite.objects.create(territory=t, coordinate=coord)

        for i, territory in enumerate(territories['dame']):
            t = Territory.objects.create(board=board, index=i)

            for coord in territory:
                TerritoryDame.objects.create(territory=t, coordinate=coord)

    def dead_stones_add(self, board, dead_stones):
        d = DeadStone.objects.create(board=board)
        for coord in dead_stones['black']:
            DeadStoneBlack.objects.create(dead_stone=d, coordinate=coord)

        for coord in dead_stones['white']:
            DeadStoneWhite.objects.create(dead_stone=d, coordinate=coord)

    def score_add(self, score):
        return Score.objects.get_or_create(**score)
