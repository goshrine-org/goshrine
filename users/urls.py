from django.urls import path, re_path

from . import views

app_name = 'users'
urlpatterns = [
    re_path('^/?$', views.index, name='index'),
    path('/<int:user_id>', views.user, name='user'),
    path('/<int:user_id>/edit', views.user_edit, name='user_edit'),
    path('/sign_up', views.sign_up, name='sign_up'),
    path('/sign_in', views.sign_in, name='sign_in'),
    path('/sign_out', views.sign_out, name='sign_out'),
]
