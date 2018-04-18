from django.conf.urls import url

from . import views

app_name = 'users'
urlpatterns = [
    url('^/sign_up$', views.sign_up, name='sign_up'),
    url('^/?$', views.index, name='index'),
]
