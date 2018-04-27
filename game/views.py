from django.shortcuts import render
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from .forms import MatchCreateForm
from rooms.models import Room
from users.models import User

# XXX: called by application.js shit.  Later we need to set the CSRF
# cookie.
# https://stackoverflow.com/questions/6506897/csrf-token-missing-or-incorrect-while-post-parameter-via-ajax-in-django
@csrf_exempt
def match_create(request):
    if request.method != 'POST':
        raise Http404()

    form = MatchCreateForm(request.POST)
    if not form.is_valid():
        raise Http404()

    target_user_id = form.cleaned_data['challenged_player_id']
    room_id        = form.cleaned_data['room_id']

    try:
        target_user = User.objects.get(pk=target_user_id)
        room        = Room.objects.get(pk=room_id)
    except (User.DoesNotExist, Room.DoesNotExist):
       raise Http404()

    context = {
        'target_user': target_user,
        'room'       : room
    }
    return render(request, 'game/match_create.html', context)
