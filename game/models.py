from django.db import models
from django.db import models
from django.utils import timezone
from django.core.validators import validate_slug, MinLengthValidator

class Move(models.Model):
    board       = models.ForeignKey('game.Game', related_name='moves', on_delete=models.CASCADE)
    number      = models.PositiveSmallIntegerField(blank=False, null=False)
    coordinates = models.CharField(max_length=4, blank=False, null=False)

class Board(models.Model):
    size = models.PositiveSmallIntegerField(blank=False, null=False, default=19)

class Game(models.Model):
    started_at   = models.DateTimeField(default=timezone.now)
    token        = models.CharField(max_length=8, blank=False)
    state        = models.CharField(max_length=8, blank=False)
    turn         = models.CharField(max_length=1, default='b')
    move_number  = models.PositiveSmallIntegerField(default=0)
    black_capture_count = models.PositiveSmallIntegerField(default=0)
    white_capture_count = models.PositiveSmallIntegerField(default=0)
    last_move    = models.CharField(max_length=4, blank=False)
    komi         = models.DecimalField(max_digits=4, decimal_places=1, default=6.5)
    updated_at   = models.DateTimeField(default=timezone.now)
    game_type    = models.CharField(max_length=16)
    result       = models.CharField(max_length=8)
    handicap     = models.PositiveSmallIntegerField(null=False, default=0)
    timed        = models.BooleanField(default=False)
    main_time    = models.PositiveSmallIntegerField(null=True, default=None)
    byo_yomi     = models.BooleanField(null=True, default=None)
    black_seconds_left = models.PositiveIntegerField(null=True, default=None)
    white_seconds_left = models.PositiveIntegerField(null=True, default=None)
    turn_started_at = models.DateTimeField(default=timezone.now)
    room         = models.ForeignKey('rooms.Room', related_name='games', on_delete=models.SET_NULL, null=True)
    version      = models.PositiveIntegerField()
    finished_at  = models.DateTimeField(default=None)
    black_player = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE)
    white_player = models.ForeignKey('users.User', related_name='+', on_delete=models.CASCADE)
    board        = models.OneToOneField(Board, on_delete=models.CASCADE, primary_key=True)
    handicap_stones = None
    byo_yomi_periods = models.PositiveSmallIntegerField(null=True, default=None)
    byo_yomi_seconds = models.PositiveSmallIntegerField(null=True, default=None)
