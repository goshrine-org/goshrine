from django.urls import path, re_path
from . import views

app_name = 'login'
urlpatterns = [
    re_path('^/?$', views.login, name='login')
]
