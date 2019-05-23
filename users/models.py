from django.db import models
from django.utils import timezone
from django.db.models import Q
from django.db.models.functions import Length
from django.contrib.postgres.fields import CICharField, CIEmailField
from django.core.validators import RegexValidator, MinLengthValidator
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.base_user import BaseUserManager

CICharField.register_lookup(Length)
CIEmailField.register_lookup(Length)

class UsernameField(CICharField):
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
    class Meta:
        constraints = [
            models.CheckConstraint(check=Q(login__length__gte=3), name='login_too_small'),
            models.CheckConstraint(check=Q(email__length__gte=3), name='email_too_small'),
        ]

    objects            = UserManager()
    USERNAME_FIELD     = 'login'
    REQUIRED_FIELDS    = ['email']

    # XXX: TODO https://stackoverflow.com/questions/26309431/django-admin-can-i-define-fields-order
    login              = UsernameField(max_length=28, blank=False, null=False, unique=True, db_index=True)
    email              = CIEmailField(max_length=255, unique=True, db_index=True)
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
