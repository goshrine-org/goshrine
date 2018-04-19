from django.urls import path, re_path
from . import views

app_name = 'rooms'
urlpatterns = [
    re_path('^/?$', views.index, name='rooms'),
    path('/messages/<int:room_id>', views.messages)
]
