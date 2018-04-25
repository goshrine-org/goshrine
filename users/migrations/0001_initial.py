# Generated by Django 2.0.4 on 2018-04-25 10:34

from django.db import migrations, models
import django.utils.timezone
import users.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('login', users.models.UsernameField(max_length=28, unique=True)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('rank', models.CharField(default='?', max_length=5)),
                ('avatar_pic', models.CharField(blank=True, default='', max_length=256)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('location', models.CharField(blank=True, default='', max_length=50)),
                ('url', models.CharField(blank=True, default='', max_length=300)),
                ('bio', models.CharField(blank=True, default='', max_length=300)),
                ('click_sounds_flag', models.BooleanField(default=True)),
                ('notice_sounds_flag', models.BooleanField(default=True)),
                ('available', models.BooleanField(default=True)),
                ('administrator', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]