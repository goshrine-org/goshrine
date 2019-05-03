import json
from django.core.management.base import BaseCommand, CommandError
from game.models import *
from users.models import User

class Command(BaseCommand):
    help = 'Import a goshrine.com json user dump into the database.'

    def add_arguments(self, parser):
        parser.add_argument('pathnames', nargs='+')

    def handle(self, *args, **options):
        for pathname in options['pathnames']:
            self.handle_file(pathname)
            self.stdout.write(self.style.SUCCESS(pathname))

    def handle_file(self, pathname):
        with open(pathname, 'r') as f:
            users = json.load(f)

            for user in users:
                if user['id'] == 1: continue
                if 'user_type' not in user or user['user_type'] is None: user['user_type'] = 'user'
                if user['avatar_pic'] is None: user['avatar_pic'] = ''
                print(f"Creating user {user['id']}...")
                _, created = User.objects.get_or_create(**user)
                if created:
                    print(f"Created user {user['id']}...")
                else:
                    print(f'User {user["id"]} already exists...')
