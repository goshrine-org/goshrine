from django.shortcuts import render
from game.models import Game
from common import flash
from rooms.views import rooms

def index(request):
    return rooms(request, 1)

def about(request):
    flashes = flash.flashes_get(request)
    return render(request, 'home/about.html', {'flashes': flashes})

def video_intro(request):
    flashes = flash.flashes_get(request)
    return render(request, 'welcome/video_intro.html', {'flashes': flashes})
