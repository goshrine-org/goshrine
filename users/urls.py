from django.urls import path, re_path

from . import views

app_name = 'users'
urlpatterns = [
    re_path('^/?$', views.index, name='index'),
    path('/sign_up', views.sign_up, name='sign_up'),
    path('/sign_in', views.sign_in, name='sign_in')
]
