from django.db import models
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
    username = UsernameField(max_length=28)
    email    = models.EmailField(max_length=32)
    password = PasswordField(max_length=20)
