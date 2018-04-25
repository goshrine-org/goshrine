from django.shortcuts import render
from common import flash

def index(request):
    flashes = flash.flashes_get(request)
    return render(request, 'home/index.html', {'flashes': flashes})

def about(request):
    flashes = flash.flashes_get(request)
    return render(request, 'home/about.html', {'flashes': flashes})

def video_intro(request):
    flashes = flash.flashes_get(request)
    return render(request, 'welcome/video_intro.html', {'flashes': flashes})
