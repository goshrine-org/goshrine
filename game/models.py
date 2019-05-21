import io
import uuid
from itertools import chain
from django.db import models
from django.db.models import F, Q
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

class Territory(models.Model):
    game  = models.OneToOneField('game.Game', related_name='territory', on_delete=models.CASCADE)
    black = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True, default=list)
    white = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True, default=list)
    dame  = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True, default=list)

    def sgf(self):
        sio = io.StringIO()

        if not self.black and not self.white:
            return ''

        # Black territory.
        sio.write('TB')

        if not self.black:
            sio.write('[]')
        else:
            for c in self.black:
                sio.write(f'[{c}]')

        # White territory.
        sio.write('TW')

        if not self.white:
            sio.write('[]')
        else:
            for c in self.white:
                sio.write(f'[{c}]')

        s = sio.getvalue()
        sio.close()
        return s

class DeadStones(models.Model):
    game  = models.OneToOneField('game.Game', related_name='dead_stones_by_color', on_delete=models.CASCADE)
    black = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True, null=False)
    white = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True, null=False)

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
        index_together = unique_together = ((
            'white_territory_count', 'black_territory_count', 'white', 'black'
        ),)
    white_territory_count = models.PositiveSmallIntegerField(null=False)
    black_territory_count = models.PositiveSmallIntegerField(null=False)
    white                 = models.FloatField(null=False)
    black                 = models.FloatField(null=False)

    def result(self):
        delta = self.black - self.white
        return "{}+{}".format("BW"[delta < 0], abs(delta))

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


class TimerQuerySet(models.QuerySet):
    pass

class TimerManager(models.Manager):
    def get_queryset(self):
        return TimerQuerySet(self.model, using=self._db)

class Timer(models.Model):
    id                 = models.BigAutoField(unique=True, primary_key=True)
    game               = models.OneToOneField('game.Game', on_delete=models.CASCADE, related_name='timer')
    main_time          = models.PositiveIntegerField(default=1800)
    byo_yomi           = models.BooleanField(default=True)
    byo_yomi_periods   = models.PositiveSmallIntegerField(default=5)
    byo_yomi_seconds   = models.PositiveSmallIntegerField(default=30)

    updated_at         = models.DateTimeField(default=timezone.now)
    black_seconds_left = models.PositiveIntegerField(default=1950)
    white_seconds_left = models.PositiveIntegerField(default=1950)

    def sgf(self):
        sio = io.StringIO()
        sio.write(f'TM[{self.main_time * 60}]\n')
        if self.byo_yomi:
            sio.write(f'OT[{self.byo_yomi_periods}x{self.byo_yomi_seconds} byo-yomi]\n')
        s = sio.getvalue()
        sio.close()
        return s

def token_default():
    return str(uuid.uuid4())

class GameQuerySet(models.QuerySet):
    def in_play(self):
        return self.filter(state='in-play')

    def played_by(self, user_id):
        qs  = self.filter(black_player_id=user_id)
        qs |= self.filter(white_player_id=user_id)
        return qs

    def won_by(self, user_id):
        qs  = self.filter(black_player_id=user_id, result__startswith='B')
        qs |= self.filter(white_player_id=user_id, result__startswith='W')
        return qs

    def lost_by(self, user_id):
        qs  = self.filter(black_player_id=user_id, result__startswith='W')
        qs |= self.filter(white_player_id=user_id, result__startswith='B')
        return qs

    def resign(self, user_id):
        """Resign the games in this queryset played by 'user_id'."""
        qs = self.in_play().played_by(user_id)
        return qs.update(
            state='finished',
            result=models.Case(
                models.When(black_player_id=user_id, then=models.Value('W+R')),
                models.When(white_player_id=user_id, then=models.Value('B+R'))
            ),
            resigned_by_id=user_id,
            updated_at=models.functions.Now()
        )

class GameManager(models.Manager):
    def get_queryset(self):
        return GameQuerySet(self.model, using=self._db)

    def in_play(self):
        return self.get_queryset().in_play()

    def played_by(self, user_id):
        return self.get_queryset().played_by(user_id)

    def won_by(self, user_id):
        return self.get_queryset().won_by(user_id)

    def lost_by(self, user_id):
        return self.get_queryset().lost_by(user_id)

class Game(models.Model):
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(resigned_by=None) |
                      (Q(resigned_by=F('black_player')) & Q(result__exact='W+R')) |
                      (Q(resigned_by=F('white_player')) & Q(result__exact='B+R')),
                name='resignation_invalid'
            ),
            models.CheckConstraint(check=Q(turn__in=['b', 'w']), name='turn_constraint'),
            models.CheckConstraint(
                check=Q(result__exact='') | Q(result__startswith='B+') |
                      Q(result__startswith='W+'),
                name='result_constraint_player'
            ),
        ]

    objects      = GameManager()

    id           = models.BigAutoField(unique=True, primary_key=True)
    started_at   = models.DateTimeField(default=None, null=True, blank=True)
    token        = models.CharField(max_length=36, default=token_default, blank=False, unique=True, db_index=True)
    state        = models.CharField(max_length=16, default='new', db_index=True)
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
    komi         = models.FloatField(blank=True, null=False, default=6.5)
    updated_at   = models.DateTimeField(default=timezone.now)
    game_type    = models.CharField(max_length=16)
    result       = models.CharField(max_length=8, default='', null=False, blank=True, db_index=True)
    handicap     = models.PositiveSmallIntegerField(null=False, default=0)
    handicap_stones = ArrayField(models.CharField(max_length=2, blank=False, null=False), blank=True, null=False)
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

    def sgf(self):
        sio = io.StringIO()
        sio.write('(;FF[4]GM[1]CA[UTF-8]')
        sio.write('AP[GoShrine:1.0]RU[Japanese]\n')
        sio.write(f'SZ[{self.board.size}]\n')
        sio.write(f'HA[{self.handicap}]\n')
        sio.write(f'KM[{self.komi}]\n')
        sio.write('PC[GoShrine - http://goshrine.org]\n')
        sio.write(f'PW[{self.white_player.login}]\n')
        sio.write(f'WR[{self.white_player_rank}]\n')
        sio.write(f'PB[{self.black_player.login}]\n')
        sio.write(f'BR[{self.black_player_rank}]\n')

        try:
            sio.write(self.timer.sgf() + '\n')
        except Game.timer.RelatedObjectDoesNotExist:
            pass

        sio.write(f'RE[{self.result}]\n')
        if self.handicap != 0:
            sio.write('AB')
            for c in self.handicap_stones:
                sio.write(f'[{c}]')
            sio.write('\n')

        sio.write(Move.objects.sgf(self) + '\n')

        try:
            sio.write(self.territory.sgf() + '\n')
        except Game.territory.RelatedObjectDoesNotExist:
            pass

        sio.write(')\n')
        s = sio.getvalue()
        sio.close()
        return s
