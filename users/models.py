from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator, MinLengthValidator
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.base_user import BaseUserManager

class UsernameField(models.CharField):
    default_validators = [
        MinLengthValidator(3),
        RegexValidator("^[A-Za-z0-9_][A-Za-z0-9_.-]*$")
    ]

class PasswordField(models.CharField):
    default_validators = [
        MinLengthValidator(6)
    ]

class UserManager(BaseUserManager):
    def create_user(self, username, email, password, **extra_fields):
        user = self.model(login=username, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

class User(AbstractBaseUser):
    objects            = UserManager()
    USERNAME_FIELD     = 'login'
    login              = UsernameField(max_length=28, unique=True)
    email              = models.EmailField(max_length=255, unique=True)
    password           = PasswordField(max_length=20)
    rank               = models.CharField(max_length=5, default='?')
    avatar_pic         = models.CharField(max_length=256, blank=True, default='')
    created_at         = models.DateTimeField(default=timezone.now)
    location           = models.CharField(max_length=50, blank=True, default='')
    url                = models.CharField(max_length=300, blank=True, default='')
    bio                = models.CharField(max_length=300, blank=True, default='')
    click_sounds_flag  = models.BooleanField(default=True)
    notice_sounds_flag = models.BooleanField(default=True)
    available          = models.BooleanField(default=True)
    room               = models.ForeignKey('rooms.Room', on_delete=models.SET_NULL,
                                           null=True, related_name='users')
