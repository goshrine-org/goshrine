from django.db import models
from django.core.validators import RegexValidator, MinLengthValidator, EmailValidator

# models.CharField does not have a 'min_length' parameters, so we use
# a custom validator.
validate_username_length = MinLengthValidator(3)
validate_username        = RegexValidator("^[A-Za-z0-9_][A-Za-z0-9_.-]*$")
username_validators      = [validate_username_length, validate_username]

class User(models.Model):
    username = models.CharField(max_length=28, validators=username_validators)
    email    = models.EmailField(max_length=32)
    password = models.CharField(max_length=32)
