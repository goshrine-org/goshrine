from django.shortcuts import render
from common import flash

def index(request):
    flashes = flash.flashes_get(request)
    return render(request, 'home/index.html', {'flashes': flashes})
