from django import forms
from .models import User

class UserForm(forms.ModelForm):
    name_map = {
        'login'                     : 'user[login]',
        'email'                     : 'user[email]',
        'password'                  : 'user[password]',
        'user_password_confirmation': 'user[password_confirmation]'
    }

    user_password_confirmation = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={'id': 'user_password_confirmation', 'size': 30 })
    )

    def __init__(self, *args, **kwargs):
        super(UserForm, self).__init__(*args, **kwargs)
        self.label_suffix = ''

        self.fields['login'].error_messages = {
            'unique'    : "Login has already been taken",
            'required'  : "Login can't be blank",
            'max_length': "Login is too long (maximum is %(limit_value)s characters)",
            'min_length': "Login is too short (minimum is %(limit_value)s characters)",
            'invalid'   : "Login use only letters, numbers, and .-_ please."
        }
        self.fields['email'].error_messages    = {
            'unique'  : "Email has already been taken",
            'required': "Email needed for registration.",
            'invalid' : "Email is invalid"
        }
        self.fields['password'].error_messages = {
            'required'  : "Password can't be blank",
            'min_length': "Password is too short (minimum is %(limit_value)s characters)",
            'max_length': "Password is too long (maximum is %(limit_value)s characters)"
        }

    def add_prefix(self, field_name):
        field_name = self.name_map.get(field_name, field_name)
        return super(UserForm, self).add_prefix(field_name)

    def clean(self):
        cleaned_data = super().clean()
        password     = cleaned_data.get('password')
        confirmation = cleaned_data.get('user_password_confirmation')

        if password != confirmation:
            raise forms.ValidationError("Password doesn't match confirmation", code='invalid')

        return cleaned_data

    class Meta:
        model   = User
        fields  = ['login', 'email', 'password']
        widgets = {
            'login'   : forms.TextInput(attrs={'id': 'user_login', 'size': 30}),
            'email'   : forms.EmailInput(attrs={'id': 'user_email', 'size':30}),
            'password': forms.PasswordInput(attrs={'id': 'user_password', 'size':30})
        }
