import io
import uuid
from itertools import chain
from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import ArrayField

class MatchRequest(models.Model):
    id                = models.BigAutoField(unique=True, primary_key=True)
    created_at        = models.DateTimeField(default=timezone.now, db_index=True)
    challenged_player = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='+')
    room              = models.ForeignKey('rooms.Room', related_name='+', on_delete=models.CASCADE)
    black_player      = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='+')
    white_player      = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='+')
    board_size        = models.PositiveSmallIntegerField(blank=False, null=False, default=19)
    handicap          = models.PositiveSmallIntegerField(null=False, default=0)
    timed             = models.BooleanField(default=False)
    main_time         = models.PositiveIntegerField(null=True, default=None, blank=True)
    byo_yomi          = models.BooleanField(null=True, default=None, blank=True)

class TerritoryManager(models.Manager):
    def sgf(self, game):
        try:
            t = Territory.objects.get(game_id=game.id)
        except Territory.DoesNotExist:
            return ''

        sio = io.StringIO()

        # Black territory.
        sio.write('TB')
        for c in t.black:
            sio.write(f'[{c}]')

        # White territory.
        sio.write('TW')
        for c in t.white:
            sio.write(f'[{c}]')

        s = sio.getvalue()
        sio.close()
        return s

class Territory(models.Model):
    objects = TerritoryManager()

    game  = models.OneToOneField('game.Game', related_name='territory', on_delete=models.CASCADE)
    black = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True, default=list)
    white = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True, default=list)
    dame  = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True, default=list)

class DeadStones(models.Model):
    game  = models.OneToOneField('game.Game', related_name='dead_stones_by_color', on_delete=models.CASCADE)
    black = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True)
    white = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True)

class HandicapStoneManager(models.Manager):
    def handicap_stones(self, game):
        t = HandicapStone.objects.filter(game=game)
        return t

    def handicap_stones_values_list(self, game):
        return self.handicap_stones(game).values_list('coordinate')

    def sgf(self, game):
        sio = io.StringIO()

        sio.write('AB')
        for c in chain.from_iterable(self.handicap_stones_values_list(game)):
            sio.write(f'[{c}]')

        s = sio.getvalue()
        sio.close()
        return s

class HandicapStone(models.Model):
    objects = HandicapStoneManager()

    class Meta:
        unique_together = (('game', 'coordinate'),)
    game       = models.ForeignKey('game.Game', related_name='handicap_stones', on_delete=models.CASCADE)
    coordinate = models.CharField(max_length=2, blank=False, null=False)

class Stone(models.Model):
    class Meta:
        # Ensure that for a given board, we do not repeat the index.
        unique_together = (('board', 'index'),)

    board      = models.ForeignKey('game.Board', related_name='stones', on_delete=models.CASCADE)
    index      = models.PositiveSmallIntegerField(blank=False, null=False)
    color      = models.CharField(max_length=1, blank=False, null=True)

class Board(models.Model):
    go_game    = models.OneToOneField('game.Game', related_name='board', on_delete=models.CASCADE)
    size       = models.PositiveSmallIntegerField(blank=False, null=False, default=19)
    ko_pos     = models.CharField(max_length=2, blank=False, null=True)

class MoveManager(models.Manager):
    def moves(self, game):
        return Move.objects.filter(game=game).order_by('number')

    def sgf(self, game):
        turns = "BW"
        sio   = io.StringIO()
        for i, move in enumerate(self.moves(game)):
            coord = move.coordinate
            if coord == 'pass': coord = ''
            sio.write(f';{turns[(i + (game.handicap != 0)) % 2]}[{coord}]')

        s = sio.getvalue()
        sio.close()
        return s

class Move(models.Model):
    objects    = MoveManager()

    id         = models.BigAutoField(unique=True, primary_key=True)
    game       = models.ForeignKey('game.Game', related_name='moves', on_delete=models.CASCADE)
    number     = models.PositiveSmallIntegerField(blank=False, null=False, db_index=True)
    coordinate = models.CharField(max_length=4, blank=False, null=False)

class Score(models.Model):
    class Meta:
        unique_together = ((
            'white_territory_count', 'black_territory_count', 'white', 'black'
        ),)
    white_territory_count = models.PositiveSmallIntegerField(null=False)
    black_territory_count = models.PositiveSmallIntegerField(null=False)
    white                 = models.DecimalField(max_digits=8, decimal_places=1, null=False)
    black                 = models.DecimalField(max_digits=8, decimal_places=1, null=False)

class MessageManager(models.Manager):
    def messages(self, game):
        return Message.objects.filter(game=game).order_by('created_at')

class Message(models.Model):
    objects    = MessageManager()

    id         = models.BigAutoField(unique=True, primary_key=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    text       = models.CharField(max_length=200)
    user       = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='game_messages')
    game       = models.ForeignKey('game.Game', on_delete=models.CASCADE, related_name='messages')

def token_default():
    return str(uuid.uuid4())

class Game(models.Model):
    id           = models.BigAutoField(unique=True, primary_key=True)
    started_at   = models.DateTimeField(default=None, null=True, blank=True)
    token        = models.CharField(max_length=36, default=token_default, blank=False, unique=True, db_index=True)
    state        = models.CharField(max_length=16, default='new')
    black_seen   = models.BooleanField(default=False)
    white_seen   = models.BooleanField(default=False)
    turn         = models.CharField(max_length=1, default='b')
    move_number  = models.PositiveSmallIntegerField(default=0)
    black_capture_count = models.PositiveSmallIntegerField(default=0)
    white_capture_count = models.PositiveSmallIntegerField(default=0)
    last_move    = models.CharField(max_length=4, null=True, blank=True)
    user_done_scoring = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE, null=True, blank=True)
    match_request = models.OneToOneField(MatchRequest, related_name='game', on_delete=models.SET_NULL, null=True, blank=True)
    resigned_by  = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE, null=True, blank=True)
    komi         = models.DecimalField(max_digits=8, decimal_places=1, default=6.5)
    updated_at   = models.DateTimeField(default=timezone.now)
    game_type    = models.CharField(max_length=16)
    result       = models.CharField(max_length=8, null=True, blank=True)
    handicap     = models.PositiveSmallIntegerField(null=False, default=0)
    timed        = models.BooleanField(default=False)
    main_time    = models.PositiveIntegerField(null=True, default=None, blank=True)
    byo_yomi     = models.BooleanField(null=True, default=None, blank=True)
    black_seconds_left = models.PositiveIntegerField(null=True, default=None, blank=True)
    white_seconds_left = models.PositiveIntegerField(null=True, default=None, blank=True)
    turn_started_at = models.DateTimeField(default=None, null=True, blank=True)
    room         = models.ForeignKey('rooms.Room', related_name='games', on_delete=models.SET_NULL, null=True, blank=True)
    version      = models.PositiveIntegerField(default=0)
    # These are not duplicated of 'white_player.rank' and 'black_player.rank'
    # because they store the rank *at the time the game was played*, instead
    # of the current player rank.
    white_player_rank = models.CharField(max_length=5, default='?')
    black_player_rank = models.CharField(max_length=5, default='?')
    score        = models.ForeignKey('game.Score', related_name='games', on_delete=models.SET_NULL, default=None, null=True, blank=True)
    black_player = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE)
    white_player = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE)
    byo_yomi_periods = models.PositiveSmallIntegerField(null=True, default=None, blank=True)
    byo_yomi_seconds = models.PositiveSmallIntegerField(null=True, default=None, blank=True)

    def sgf(self):
        sio = io.StringIO()
        sio.write('(;FF[4]GM[1]CA[UTF-8]')
        sio.write('AP[GoShrine:1.0]RU[Japanese]\n')
        sio.write(f'SZ[{self.board.size}]\n')
        sio.write(f'H[{self.handicap}]\n')
        sio.write(f'KM[{self.komi}]\n')
        sio.write('PC[GoShrine - http://goshrine.org]\n')
        sio.write(f'PW[{self.white_player.login}]\n')
        sio.write(f'WR[{self.white_player_rank}]\n')
        sio.write(f'PB[{self.black_player.login}]\n')
        sio.write(f'BR[{self.black_player_rank}]\n')
        # XXX: TODO DT
        if self.timed:
            sio.write(f'TM[{self.main_time * 60}]\n')
            if self.byo_yomi:
                sio.write(f'OT[{self.byo_yomi_periods}x{self.byo_yomi_seconds} byo-yomi]\n')
        sio.write(f'RE[{self.result}]\n')
        if self.handicap != 0:
            sio.write(HandicapStone.objects.sgf(self) + '\n')
        sio.write(Move.objects.sgf(self) + '\n')
        sio.write(Territory.objects.sgf(self) + '\n')
        s = sio.getvalue()
        sio.close()
        return s
