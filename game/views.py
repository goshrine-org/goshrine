from django.shortcuts import render
from django.http import Http404

def match_create(request):
    if request.method != 'GET':
        raise Http404()

    if 'challenged_player_id' not in request.GET:
        raise Http404()

    if 'room_id' not in request.GET:
        raise Http404()

    return render(request, 'game/match_create.html', {})
