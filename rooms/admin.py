from django.contrib import admin
from .models import Room, Message, RoomChannel

admin.site.register(Room)
admin.site.register(Message)
admin.site.register(RoomChannel)
