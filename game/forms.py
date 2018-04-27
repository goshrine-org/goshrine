from django import forms

class MatchCreateForm(forms.Form):
    room_id              = forms.IntegerField(required=True)
    challenged_player_id = forms.IntegerField(required=True)

class MatchProposeForm(forms.Form):
    room_id              = forms.IntegerField(required=True)
    challenged_player_id = forms.IntegerField(required=True)
    black_player_id      = forms.IntegerField(required=True)
    white_player_id      = forms.IntegerField(required=True)
    board_size           = forms.IntegerField(required=True)
    handicap             = forms.IntegerField(required=True)
    timed                = forms.BooleanField(required=False)
    main_time            = forms.IntegerField(required=False)
    byo_yomi             = forms.BooleanField(required=False)

    def clean(self):
        cleaned_data = super().clean()

        timed     = cleaned_data.get('timed')
        main_time = cleaned_data.get('main_time')
        byo_yomi  = cleaned_data.get('byo_yomi')

        if not timed:
            return cleaned_data

        if main_time is None or byo_yomi is None:
            raise forms.ValidationError('timed set, but no main time or byo yomi set.', code='invalid')

        return cleaned_data
