from django.urls import path, re_path
from . import views

app_name = 'game'
urlpatterns = [
    path('/<slug:token>/game_for_eidogo',               views.game_for_eidogo),
    path('/<slug:token>/attempt_start',                 views.attempt_start),
    path('/<slug:token>/move/<slug:coord>',             views.move),
    path('/<slug:token>/time_elapsed',                  views.time_elapsed),
    path('/<slug:token>/mark_group_alive/<slug:coord>', views.mark_group_alive),
    path('/<slug:token>/mark_group_dead/<slug:coord>',  views.mark_group_dead),
    path('/<slug:token>/done_scoring',                  views.done_scoring),
    path('/<slug:token>/chat',                          views.chat),
    path('/<slug:token>/messages',                      views.messages),
    path('/<slug:token>/resign',                        views.resign)
]
