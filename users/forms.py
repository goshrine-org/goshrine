from django.core.files.storage import FileSystemStorage
from django.core.validators import ValidationError
import os
import string
from io import BytesIO
from PIL import Image, ImageOps
from django import forms
from .models import User

user_name_map = {
    'login'                     : 'user[login]',
    'email'                     : 'user[email]',
    'password'                  : 'user[password]',
    'user_password_confirmation': 'user[password_confirmation]',
    'location'                  : 'user[location]',
    'url'                       : 'user[url]',
    'bio'                       : 'user[bio]',
    'click_sounds_flag'         : 'user[click_sounds_flag]',
    'notice_sounds_flag'        : 'user[notice_sounds_flag]',
    'available'                 : 'user[available]',
    'photo'                     : 'user[photo]'
}

# We do not rely on the User model, as the login field can represent either
# an email address or a password.
class LoginForm(forms.Form):
    login    = forms.CharField(
        label  = 'Email or Username',
        widget = forms.TextInput(attrs={'id': 'user_login', 'size': 20})
    )

    password = forms.CharField(
        label  = 'Password',
        widget = forms.PasswordInput(attrs={'id': 'user_password', 'size': 20 })
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.label_suffix = ''

    def add_prefix(self, field_name):
        field_name = user_name_map.get(field_name, field_name)
        return super().add_prefix(field_name)

#class PasswordField(models.CharField):
#    default_validators = [
#        MinLengthValidator(6)
#    ]
class UserForm(forms.ModelForm):
    user_password_confirmation = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={'id': 'user_password_confirmation', 'size': 30 })
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
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
        field_name = user_name_map.get(field_name, field_name)
        return super().add_prefix(field_name)

    def clean_login(self):
        login = self.cleaned_data['login']
        if login and User.objects.filter(login__iexact=login).exists():
            code = 'unique'
            msg  = self.fields['login'].error_messages[code]
            raise forms.ValidationError(msg, code=code)
        return login

    def clean_email(self):
        email = self.cleaned_data['email']
        if email and User.objects.filter(email__iexact=email).exists():
            code = 'unique'
            msg  = self.fields['email'].error_messages[code]
            raise forms.ValidationError(msg, code=code)
        return email

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

class EditForm(forms.ModelForm):
    avatar_pic = forms.ImageField(
        required = False,
        label    = 'Upload a new picture',
        widget   = forms.FileInput(attrs={'id': 'user_photo'})
    )
    field_order = ['avatar_pic']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.label_suffix = ''

        self.user = kwargs['instance']

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

    def clean_avatar_pic(self):
        # See if this submission has an avatar_pic.
        avatar_pic = self.cleaned_data['avatar_pic']
        if avatar_pic is None:
            return None

        valid = set(string.ascii_letters + string.digits + "-_.")
        if set(avatar_pic.name) - valid:
            raise ValidationError('Image use only letters, numbers, and .-_ please.', 'invalid')

        return avatar_pic

    def add_prefix(self, field_name):
        field_name = user_name_map.get(field_name, field_name)
        return super().add_prefix(field_name)

    def _thumbnail(self, f, size):
        pic_thumb = BytesIO()
        img       = Image.open(f)
        img_thumb = ImageOps.fit(img, size, Image.ANTIALIAS)
        img_thumb.save(pic_thumb, format=img.format)
        return pic_thumb

    def _save_image(self, fs, path, image):
        fs.delete(path)
        fs.save(path, image)

    def save(self):
        # If no avatar pic was provided, just save the model.
        pic = self.cleaned_data['avatar_pic']
        if pic is None:
            return super().save()

        filename     = os.path.basename(pic.name)
        content_type = pic.content_type
        pic_thumb    = self._thumbnail(pic, (46, 46))
        pic_small    = self._thumbnail(pic, (115, 150))

        fs = FileSystemStorage(location='media/photos/{}/'.format(self.user.id))
        self._save_image(fs, 'original/{}'.format(filename), pic)
        self._save_image(fs, 'thumb/{}'.format(filename), pic_thumb)
        self._save_image(fs, 'small/{}'.format(filename), pic_small)

        user = super().save(commit=False)
        user.avatar_pic = filename
        return user.save()

    class Meta:
        model   = User
        fields  = ['login', 'email', 'location', 'url', 'bio',
                   'click_sounds_flag', 'notice_sounds_flag', 'available']
        widgets = {
            'login'   : forms.TextInput(attrs={'id': 'user_login', 'size': 20}),
            'email'   : forms.EmailInput(attrs={'id': 'user_email', 'size': 20}),
            'location': forms.TextInput(attrs={'id': 'user_location', 'size': 20}),
            'url'     : forms.TextInput(attrs={'id': 'user_url', 'size': 20}),
            'bio'     : forms.TextInput(attrs={'id': 'user_bio', 'size': 20}),
            'click_sounds_flag': forms.CheckboxInput(attrs={'id': 'user_click_sounds_flag'}),
            'notice_sounds_flag': forms.CheckboxInput(attrs={'id': 'user_notice_sounds_flag'}),
            'available': forms.CheckboxInput(attrs={'id': 'user_available'})
        }
        labels = {
            'login'             : 'Username',
            'email'             : 'Email address',
            'url'               : 'Website',
            'bio'               : 'Description',
            'click_sounds_flag' : 'Audible stone placement',
            'notice_sounds_flag': 'Play chime on match request',
            'available'         : 'Let others challenge you?'
        }
