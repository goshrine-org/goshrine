from django.shortcuts import render
from game.models import Game
from common import flash

def index(request):
    # Get the 11 most recent games from the database and pass them to render.
    games = Game.objects.filter(room=1).order_by('-started_at')[:11]

    flashes = flash.flashes_get(request)
    return render(request, 'home/index.html', {'flashes': flashes, 'games': games})

def about(request):
    flashes = flash.flashes_get(request)
    return render(request, 'home/about.html', {'flashes': flashes})

def video_intro(request):
    flashes = flash.flashes_get(request)
    return render(request, 'welcome/video_intro.html', {'flashes': flashes})
