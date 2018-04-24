from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model, login, authenticate, logout
from common import flash
from .forms import UserForm, LoginForm
import itertools

User = get_user_model()

def index(request):
    if request.method == 'POST':
        form = UserForm(request.POST)

        # Flatten the error lists per field, as this is what goshrine.com does.
        errors = []
        if not form.is_valid():
            errors  = itertools.chain.from_iterable(form.errors.values())
            context = {'form': form, 'errors': errors}
            return render(request, 'users/sign_up.html', context)

        # Successful post, so we store, login, and redirect.
        username = form.cleaned_data['login']
        email    = form.cleaned_data['email']
        password = form.cleaned_data['password']
        user     = User.objects.create_user(username, email, password)
        login(request, user)
        return render(request, 'home/index.html', {})

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
            context = {'form': form, 'errors': errors}
            return render(request, 'users/sign_in.html', context)

        username = form.cleaned_data['login']
        password = form.cleaned_data['password']
        user     = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            msg     = 'Signed in successfully.'
            flashes = [{'color': 'green', 'msg': msg, 'bold': False}]
            flash.flashes_set(request, flashes)
            return redirect('/')
        else:
            msg     = 'Invalid email or password.'
            flashes = [{'color': 'red', 'msg': msg, 'bold': True}]
            context = {'form': form, 'flashes': flashes}
            return render(request, 'users/sign_in.html', context)

    return render(request, 'users/sign_in.html', {'form': LoginForm()})

def sign_out(request):
    if request.user is not None and request.user.is_authenticated:
        logout(request)
        msg     = 'Signed out successfully.'
        flashes = [{'color': 'green', 'msg': msg, 'bold': False}]
        flash.flashes_set(request, flashes)
    return redirect('/')

def user(request, user_id):
    try:
        target_user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
       raise Http404()

    return render(request, 'users/user.html', {'target_user': target_user})

def user_edit(request, user_id):
    pass
