from django.urls import path, re_path
from . import views

app_name = 'game'
urlpatterns = [
    path('/<slug:token>/game_for_eidogo',    views.game_for_eidogo),
    path('/<slug:token>/attempt_start',      views.attempt_start),
    path('/<slug:token>/move/<slug:coord>',  views.move)
]
