from django.db import models
from django.utils import timezone

class MatchRequest(models.Model):
    dummy = models.CharField(max_length=1, default='x')

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

class HandicapStone(models.Model):
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

class Move(models.Model):
    game       = models.ForeignKey('game.Game', related_name='moves', on_delete=models.CASCADE)
    number     = models.PositiveSmallIntegerField(blank=False, null=False)
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

class Game(models.Model):
    started_at   = models.DateTimeField(default=timezone.now)
    token        = models.CharField(max_length=8, blank=False)
    state        = models.CharField(max_length=8, blank=False)
    turn         = models.CharField(max_length=1, default='b')
    move_number  = models.PositiveSmallIntegerField(default=0)
    black_capture_count = models.PositiveSmallIntegerField(default=0)
    white_capture_count = models.PositiveSmallIntegerField(default=0)
    last_move    = models.CharField(max_length=4, blank=False)
    user_done_scoring = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE, null=True, blank=True)
    match_request = models.OneToOneField(MatchRequest, related_name='game', on_delete=models.SET_NULL, null=True, blank=True)
    resigned_by  = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE, null=True, blank=True)
    komi         = models.DecimalField(max_digits=8, decimal_places=1, default=6.5)
    updated_at   = models.DateTimeField(default=timezone.now)
    game_type    = models.CharField(max_length=16)
    result       = models.CharField(max_length=8)
    handicap     = models.PositiveSmallIntegerField(null=False, default=0)
    timed        = models.BooleanField(default=False)
    main_time    = models.PositiveSmallIntegerField(null=True, default=None, blank=True)
    byo_yomi     = models.BooleanField(null=True, default=None)
    black_seconds_left = models.PositiveIntegerField(null=True, default=None, blank=True)
    white_seconds_left = models.PositiveIntegerField(null=True, default=None, blank=True)
    turn_started_at = models.DateTimeField(default=timezone.now)
    room         = models.ForeignKey('rooms.Room', related_name='games', on_delete=models.SET_NULL, null=True, blank=True)
    version      = models.PositiveIntegerField()
    # These are not duplicated of 'white_player.rank' and 'black_player.rank'
    # because they store the rank *at the time the game was played*, instead
    # of the current player rank.
    white_player_rank = models.CharField(max_length=5, default='?')
    black_player_rank = models.CharField(max_length=5, default='?')
    finished_at  = models.DateTimeField(default=None)
    score        = models.ForeignKey('game.Score', related_name='games', on_delete=models.SET_NULL, null=True, blank=True)
    black_player = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE)
    white_player = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE)
    byo_yomi_periods = models.PositiveSmallIntegerField(null=True, default=None, blank=True)
    byo_yomi_seconds = models.PositiveSmallIntegerField(null=True, default=None, blank=True)
