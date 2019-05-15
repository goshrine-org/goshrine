from django.contrib import admin
from .models import *

admin.site.register(Game)
admin.site.register(Message)
admin.site.register(Move)
admin.site.register(Board)
admin.site.register(Stone)

admin.site.register(Score)
admin.site.register(MatchRequest)

admin.site.register(DeadStones)
admin.site.register(Territory)
