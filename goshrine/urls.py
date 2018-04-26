"""goshrine URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render
from home import views as home_views
from users import views as users_views

urlpatterns = [
    re_path('^/?$',                home_views.index),
    re_path('^about/?$',           home_views.about),
       path('admin',               admin.site.urls),
       path('home',                include('home.urls')),
       path('welcome/video_intro', home_views.video_intro),
    re_path('^login/?$',           users_views.sign_in),
    re_path('^logout/?$',          users_views.sign_out),
    re_path('^players/?$',         users_views.index),
       path('players/<username>',  users_views.players),
       path('rooms',               include('rooms.urls')),
       path('users',               include('users.urls')),
       path('application.css',     render,
           kwargs={
               'template_name': 'application.css',
               'content_type' : 'text/css'
           }
       ),
] + static('/photos/', document_root='{}/photos/'.format(settings.MEDIA_ROOT))
