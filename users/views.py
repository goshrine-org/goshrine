from django.shortcuts import render, redirect
from django.http import Http404
from django.contrib.auth import get_user_model, login, authenticate, logout
from django.core.paginator import Paginator
from common import flash
from .forms import UserForm, LoginForm, EditForm
from django.core.validators import RegexValidator, ValidationError
from game.models import Game
import itertools

User = get_user_model()

def _user_get(request):
    if not hasattr(request, 'user'):
        return None
    return request.user

def _user_authenticated_get(request):
    user = _user_get(request)
    if user is None: return None
    if not hasattr(user, 'is_authenticated'): return None
    if not user.is_authenticated: return None
    return user

def _user_target_get(user_id):
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return None

def players(request, username):
    # XXX: code duplication.
    username_validator = RegexValidator("^[A-Za-z0-9_][A-Za-z0-9_.-]*$")

    try:
        username_validator(username)
        target_user = User.objects.get(login=username)

        qs  = Game.objects.filter(black_player_id=target_user.id)
        qs |= Game.objects.filter(white_player_id=target_user.id)
        qs  = qs.order_by('-updated_at')[:20]
    except (ValidationError, User.DoesNotExist):
       raise Http404()

    return render(request, 'users/user.html', {'target_user': target_user, 'games': list(qs)})

def index(request):
    if request.method != 'POST':
        users     = User.objects.all()
        paginator = Paginator(users, 50)
        page      = request.GET.get('page')
        users     = paginator.get_page(page)

        context   = {
            'span_start' : 2,
            'span_end'   : 2,
            'span_before': 4,
            'span_after' : 4,
            'users'      : users
        }
        return render(request, 'users/index.html', context)

    # User registration is POSTed to '/users', and we handle it here.
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

    msg     = 'Congrats! You have signed up successfully, and can now challenge other players.'
    flashes = [{'color': 'green', 'msg': msg, 'bold': False}]
    flash.flashes_set(request, flashes)
    return redirect('/')

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
    target_user = _user_target_get(user_id)
    if target_user is None:
       raise Http404()

    if request.method != 'POST':
        qs  = Game.objects.filter(black_player_id=target_user.id)
        qs |= Game.objects.filter(white_player_id=target_user.id)
        qs  = qs.order_by('-updated_at')[:20]
        return render(request, 'users/user.html', {'target_user': target_user, 'games': list(qs)})

    form   = EditForm(request.POST, request.FILES, instance=target_user)
    errors = []
    if not form.is_valid():
        # Reload 'targer_user' as we may have mucked it up if the form is
        # invalid.
        target_user = _user_target_get(user_id)
        errors  = itertools.chain.from_iterable(form.errors.values())
        context = {
            'form'       : form,
            'target_user': target_user,
            'errors'     : errors
        }
        return render(request, 'users/edit.html', context)

    form.save()

    msg = 'Settings were successfully updated.'
    flashes = [{'color': 'green', 'msg': msg, 'bold': False}]
    flash.flashes_set(request, flashes)
    return redirect('/')

def user_edit(request, user_id):
    user        = _user_authenticated_get(request)
    target_user = _user_target_get(user_id)

    if user is None:
        msg = 'You must be logged in to access this page.'
        flashes = [{'color': 'green', 'msg': msg, 'bold': False}]
        flash.flashes_set(request, flashes)
        return redirect('/')

    if target_user is None or target_user.id != user.id:
        msg = "You don't have privileges to access this page."
        flashes = [{'color': 'green', 'msg': msg, 'bold': False}]
        flash.flashes_set(request, flashes)
        return redirect('/')

    context = {
        'form': EditForm(instance=target_user),
        'target_user': target_user
    }
    return render(request, 'users/edit.html', context)
