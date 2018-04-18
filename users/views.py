import string
import re

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib import messages

from .forms import UserForm

def validate_user_creation(request):
    errors = []

    try:
        validate_email(email)
    except ValidationError:
        errors.append("Email is invalid")

    confirmation = request.POST.get('user[password_confirmation]', None)
    if password != confirmation:
        errors.append("Password doesn't match confirmation")

    return errors

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def index(request):
    if request.method == 'POST':
        form = UserForm(request.POST)

        # Flatten the error lists per field, as this is what goshrine.com does.
        errors = []
        if not form.is_valid():
            for field in form.fields:
                errors += (form[field].errors)

        template = loader.get_template('users/sign_up.html')
        return HttpResponse(template.render({'form': form, 'errors': errors}, request))

    template = loader.get_template('users/index.html')
    return HttpResponse(template.render({}, request))

def sign_up(request):
    form     = UserForm()
    template = loader.get_template('users/sign_up.html')
    return HttpResponse(template.render({'form': form}, request))
