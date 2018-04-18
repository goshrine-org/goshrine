import string
import re
import itertools

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib import messages

from .models import User
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
            errors  = itertools.chain.from_iterable(form.errors.values())
            context = { 'form': form, 'errors': errors }
            return render(request, 'users/sign_up.html', context)

        # Successful post, so we store and redirect.
        form.save()

    users = User.objects.all()
    return render(request, 'users/index.html', { 'users': users })

def sign_up(request):
    return render(request, 'users/sign_up.html', {'form': UserForm()})
