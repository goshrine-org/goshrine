from django.contrib import admin
from .models import User

@admin.register(User)

class UserAdmin(admin.ModelAdmin):
    fields = (
        'login', 'password', 'email', 'rank', 'location', 'url', 'avatar_pic',
        'bio', 'click_sounds_flag', 'notice_sounds_flag', 'available', 
        'administrator', 'created_at',
    )
