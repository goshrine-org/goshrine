"""
Django settings for goshrine project.

Generated by 'django-admin startproject' using Django 2.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

import os
from datetime import timedelta

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '[redacted]'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG         = False
APPEND_SLASH  = False

ALLOWED_HOSTS = ["127.0.0.1", "goshrine.org"]

CSRF_TRUSTED_ORIGINS = ["https://goshrine.org"]

# Application definition

INSTALLED_APPS = [
    'game.apps.GameConfig',
    'events.apps.EventsConfig',
    'home.apps.HomeConfig',
    'rooms.apps.RoomsConfig',
    'users.apps.UsersConfig',
#    'django_celery_beat',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',
    'mathfilters',
    'channels'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware'
]

ROOT_URLCONF = 'goshrine.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.media',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'libraries': {
                'goshrine_tags': 'templatetags.path'
            },
        },
    },
]

ASGI_APPLICATION = "goshrine.routing.application"
WSGI_APPLICATION = 'goshrine.wsgi.application'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("localhost", 6379)],
        },
    },
}

CELERY_BROKER_URL   = 'redis://localhost:6379'
CELERYBEAT_SCHEDULE = {
    'prune-channels': {
        'task'    : 'events.tasks.prune_channels',
        'schedule': timedelta(seconds=60)
    },
}

# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE'  : 'django.db.backends.postgresql_psycopg2',
        'NAME'    : 'goshrine',
        'USER'    : 'goshrine',
        'PASSWORD': '[redacted]',
        'HOST'    : 'localhost',
        'PORT'    : '',
    }
}

AUTH_USER_MODEL = 'users.User'
# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

X_FRAME_OPTIONS = 'DENY'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

MEDIA_ROOT       = os.path.join(BASE_DIR, 'media')
MEDIA_URL        = '/media/'
STATIC_ROOT      = os.path.join(BASE_DIR, "staticfiles")
STATIC_URL       = '/static/'
STATICFILES_DIRS = [ os.path.join(BASE_DIR, "static"), ]
