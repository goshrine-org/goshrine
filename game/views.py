from django.shortcuts import render
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt

# XXX: called by application.js shit.  Later we need to set the CSRF
# cookie.
# https://stackoverflow.com/questions/6506897/csrf-token-missing-or-incorrect-while-post-parameter-via-ajax-in-django
@csrf_exempt
def match_create(request):
    if request.method != 'POST':
        raise Http404()

    if 'challenged_player_id' not in request.POST:
        raise Http404()

    if 'room_id' not in request.POST:
        raise Http404()

    return render(request, 'game/match_create.html', {})
