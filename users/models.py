from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator, MinLengthValidator

class UsernameField(models.CharField):
    default_validators = [
        MinLengthValidator(3),
        RegexValidator("^[A-Za-z0-9_][A-Za-z0-9_.-]*$")
    ]

class PasswordField(models.CharField):
    default_validators = [
        MinLengthValidator(6)
    ]

class User(models.Model):
    login              = UsernameField(max_length=28, unique=True)
    email              = models.EmailField(max_length=255, unique=True)
    password           = PasswordField(max_length=20)
    rank               = models.CharField(max_length=5, default='?')
    avatar_pic         = models.CharField(max_length=256, default='')
    created_at         = models.DateTimeField(default=timezone.now)
    location           = models.CharField(max_length=50, default='')
    url                = models.CharField(max_length=300, default='')
    bio                = models.CharField(max_length=300, default='')
    click_sounds_flag  = models.BooleanField(default=True)
    notice_sounds_flag = models.BooleanField(default=True)
    available          = models.BooleanField(default=True)
