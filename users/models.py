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

class UserManager(BaseUserManager):
    def create_user(self, login, email, password, **extra_fields):
        user = self.model(login=login, email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, login, email, password, **extra_fields):
        user = self.model(login=login, email=email, **extra_fields)
        user.set_password(password)
        user.administrator = True
        user.save()
        return user

class User(AbstractBaseUser):
    objects            = UserManager()
    USERNAME_FIELD     = 'login'
    REQUIRED_FIELDS    = ['email']

    # XXX: TODO https://stackoverflow.com/questions/26309431/django-admin-can-i-define-fields-order

    id                 = models.BigAutoField(unique=True, primary_key=True)
    login              = UsernameField(max_length=28, unique=True, db_index=True)
    email              = models.EmailField(max_length=255, unique=True)
    rank               = models.CharField(max_length=5, default='?')
    avatar_pic         = models.CharField(max_length=256, blank=True, default='')
    created_at         = models.DateTimeField(default=timezone.now)
    user_type          = models.CharField(max_length=16, blank=True, default='user')
    location           = models.CharField(max_length=50, blank=True, default='')
    url                = models.CharField(max_length=300, blank=True, default='')
    bio                = models.CharField(max_length=300, blank=True, default='')
    click_sounds_flag  = models.BooleanField(default=True)
    notice_sounds_flag = models.BooleanField(default=True)
    available          = models.BooleanField(default=True)
    administrator      = models.BooleanField(default=False)

    def has_module_perms(self, app_label):
        return self.administrator

    def has_perm(self, perm, obj=None):
        return self.administrator

    @property
    def is_staff(self):
        return self.administrator
