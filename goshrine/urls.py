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
from django.shortcuts import render
from home import views as home_views
from users import views as users_views

urlpatterns = [
    re_path('^/?$',       home_views.index),
       path('admin',      admin.site.urls),
       path('home',       include('home.urls')),
    re_path('^login/?$',  users_views.sign_in),
    re_path('^logout/?$', users_views.sign_out),
       path('rooms',      include('rooms.urls')),
       path('users',      include('users.urls')),
       path('application.css', lambda r: render(r, 'application.css')),
]
