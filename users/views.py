import itertools
from django.shortcuts import render
from .forms  import UserForm, LoginForm
from .models import User

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

def sign_in(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)

        # Flatten the error lists per field, as this is what goshrine.com does.
        errors = []
        if not form.is_valid():
            errors  = itertools.chain.from_iterable(form.errors.values())
            context = { 'form': form, 'errors': errors }
            return render(request, 'users/sign_in.html', context)

        print("XXX: handle auth")
        print(form)

    return render(request, 'users/sign_in.html', {'form': LoginForm()})
