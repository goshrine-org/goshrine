from django import forms

class MatchCreateForm(forms.Form):
    room_id              = forms.IntegerField(required=True)
    challenged_player_id = forms.IntegerField(required=True)
