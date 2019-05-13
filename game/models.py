import io
import uuid
from itertools import chain
from django.db import models
from django.utils import timezone

class MatchRequest(models.Model):
    challenged_player = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='+')
    room              = models.ForeignKey('rooms.Room', related_name='+', on_delete=models.CASCADE)
    black_player      = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='+')
    white_player      = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='+')
    board_size        = models.PositiveSmallIntegerField(blank=False, null=False, default=19)
    handicap          = models.PositiveSmallIntegerField(null=False, default=0)
    timed             = models.BooleanField(default=False)
    main_time         = models.PositiveIntegerField(null=True, default=None, blank=True)
    byo_yomi          = models.BooleanField(null=True, default=None, blank=True)

class TerritoryInstanceManager(models.Manager):
    def territories(self, territory):
        return super().get_queryset().filter(territory=territory)

class TerritoryBlack(models.Model):
    objects    = TerritoryInstanceManager()

    class Meta:
        unique_together = (('territory', 'coordinate'),)

    territory  = models.ForeignKey('game.Territory', related_name='black', on_delete=models.CASCADE)
    coordinate = models.CharField(max_length=2, blank=False, null=False)

class TerritoryWhite(models.Model):
    objects    = TerritoryInstanceManager()

    class Meta:
        unique_together = (('territory', 'coordinate'),)

    territory  = models.ForeignKey('game.Territory', related_name='white', on_delete=models.CASCADE)
    coordinate = models.CharField(max_length=2, blank=False, null=False)

class TerritoryDame(models.Model):
    objects    = TerritoryInstanceManager()

    class Meta:
        unique_together = (('territory', 'coordinate'),)

    territory  = models.ForeignKey('game.Territory', related_name='dame', on_delete=models.CASCADE)
    coordinate = models.CharField(max_length=2, blank=False, null=False)

class TerritoryManager(models.Manager):
    def _list_convert(self, values):
        l = []
        cur = -1
        for i, c in list(values):
            if i > cur:
                cur = i
                l.append([c])
            else:
                l[-1].append(c)
        return l

    def black_values(self, board):
        t = TerritoryBlack.objects.select_related('territory').filter(territory__board=board)
        t = t.order_by('territory__index')
        t = t.values('coordinate', index=models.F('territory__index'))
        return t

    def black_values_list(self, board):
        t = TerritoryBlack.objects.select_related('territory').filter(territory__board=board)
        t = t.order_by('territory__index')
        return t.values_list('territory__index', 'coordinate')

    def white_values(self, board):
        t = TerritoryWhite.objects.select_related('territory').filter(territory__board=board)
        t = t.order_by('territory__index')
        t = t.values('coordinate', index=models.F('territory__index'))
        return t

    def white_values_list(self, board):
        t = TerritoryWhite.objects.select_related('territory').filter(territory__board=board)
        t = t.order_by('territory__index')
        return t.values_list('territory__index', 'coordinate')

    def dame_values(self, board):
        t = TerritoryDame.objects.select_related('territory').filter(territory__board=board)
        t = t.order_by('territory__index')
        t = t.values('coordinate', index=models.F('territory__index'))
        return t

    def dame_values_list(self, board):
        t = TerritoryDame.objects.select_related('territory').filter(territory__board=board)
        t = t.order_by('territory__index')
        return t.values_list('territory__index', 'coordinate')

    def black(self, board):
        return self._list_convert(self.black_values_list(board))

    def white(self, board):
        return self._list_convert(self.white_values_list(board))

    def dame(self, board):
        return self._list_convert(self.dame_values_list(board))

    def territories(self, board):
        return {
            'black': self.black(board),
            'white': self.white(board),
            'dame' : self.dame(board)
        }

    def sgf(self, board):
        sio = io.StringIO()

        # Black territory.
        sio.write('TB')
        for c in chain.from_iterable(self.black(board)):
            sio.write(f'[{c}]')

        # White territory.
        sio.write('TW')
        for c in chain.from_iterable(self.white(board)):
            sio.write(f'[{c}]')

        s = sio.getvalue()
        sio.close()
        return s

class Territory(models.Model):
    objects    = TerritoryManager()

    board      = models.ForeignKey('game.Board', related_name='territories', on_delete=models.CASCADE)
    index      = models.PositiveSmallIntegerField(blank=False, null=False)

class DeadStoneBlack(models.Model):
    class Meta:
        unique_together = (('dead_stone', 'coordinate'),)
    dead_stone = models.ForeignKey('game.DeadStone', related_name='black', on_delete=models.CASCADE)
    coordinate = models.CharField(max_length=2, blank=False, null=False)

class DeadStoneWhite(models.Model):
    class Meta:
        unique_together = (('dead_stone', 'coordinate'),)
    dead_stone = models.ForeignKey('game.DeadStone', related_name='white', on_delete=models.CASCADE)
    coordinate = models.CharField(max_length=2, blank=False, null=False)

class DeadStone(models.Model):
    board      = models.OneToOneField('game.Board', related_name='dead_stones_by_color', on_delete=models.CASCADE)

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

    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    text       = models.CharField(max_length=200)
    user       = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='game_messages')
    game       = models.ForeignKey('game.Game', on_delete=models.CASCADE, related_name='messages')

class Game(models.Model):
    started_at   = models.DateTimeField(default=None, null=True, blank=True)
    token        = models.CharField(max_length=32, default=str(uuid.uuid4()), blank=False, unique=True, db_index=True)
    state        = models.CharField(max_length=8, default='new')
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
    finished_at  = models.DateTimeField(default=None, null=True, blank=True)
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
        sio.write(Territory.objects.sgf(self.board) + '\n')
        s = sio.getvalue()
        sio.close()
        return s
