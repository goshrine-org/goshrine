from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth.models import Group
from .models import User
import django.forms as forms
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model  = User
        fields = '__all__'

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(label="Password",
        help_text="Raw passwords are not stored, so there is no way to see "
                  "this user's password, but you can change the password "
                  "using <a href=\"../password/\">this form</a>.")

    class Meta:
        model = User
        fields = '__all__'

    def clean_password(self):
        return self.initial["password"]

class MyAdminPasswordChangeForm(auth_admin.AdminPasswordChangeForm):
    def save(self, commit=True):
        """
        Saves the new password.
        """
        password = self.cleaned_data["password"]
        self.user.myuser.set_password(password)
        if commit:
            self.user.myuser.save()
        return self.user.myuser

class UserAdmin(BaseUserAdmin):
    add_form = UserCreationForm
    form     = UserChangeForm

    list_display = ('id', 'login', 'email', 'rank', 'administrator')
    list_filter  = ('administrator', 'available', 'rank')

    fieldsets = (
        (None, {'fields': ('login', 'password', 'email', 'avatar_pic', 'created_at')}),
        ('Personal info', {'fields': ('rank', 'location','bio', 'url')}),
        ('Settings',      {'fields': ('click_sounds_flag', 'notice_sounds_flag', 'available')}),
        ('Permissions',   {'fields': ('administrator',)}),
    )
    add_fields = (
        'login', 'password1', 'password2', 'email', 'rank', 'location', 'url', 'avatar_pic',
        'bio', 'click_sounds_flag', 'notice_sounds_flag', 'available', 
        'administrator', 'created_at',
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('login', 'email', 'password1', 'password2')}
        ),
    )
    search_fields = ('id', 'login')
    ordering = ('login',)
    filter_horizontal = ()

admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
