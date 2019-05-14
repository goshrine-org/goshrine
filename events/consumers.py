from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.db.models import F
from django.utils import timezone
from django.utils import html
from .models import Channel
from rooms.models import Room, Message, RoomChannel
from game.models import Game
from django.db import transaction

class TestConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._games = set()
        self._rooms = set()

        self._methods = {
            'game_join'    : self.game_join,
            'match_request': self.match_request,
            'room_join'    : self.room_join,
            'room_list'    : self.room_list,
            'room_leave'   : self.room_leave,
            'room_chat'    : self.room_chat
        }

    @database_sync_to_async
    def db_room_user_add(self, room, user, channel):
        with transaction.atomic():
            RoomChannel.objects.create(room=room, channel_id=channel)
            return RoomChannel.objects.filter(room=room, channel__user=user).count()

    @database_sync_to_async
    def db_room_user_del(self, room, user, channel):
        with transaction.atomic():
            RoomChannel.objects.filter(room=room, channel_id=channel).first().delete()
            return RoomChannel.objects.filter(room=room, channel__user=user).count()

    @database_sync_to_async
    def db_user_get(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def db_list_room(self, room):
        fields_as = ('id', 'login', 'rank', 'avatar_pic', 'user_type', 'available')
        fields_q  = ('channel__user__' + field for field in fields_as)
        fields_as = { k: F(v) for (k, v) in zip(fields_as, fields_q) }
        return RoomChannel.objects.filter(room=room).select_related('channel__user').values(*fields_q).distinct().values(**fields_as)

    @database_sync_to_async
    def get_room(self, room_id):
        try:
            return Room.objects.get(pk=room_id)
        except Room.DoesNotExist:
            return None

    @database_sync_to_async
    def db_game_get(self, game_token):
        try:
            return Game.objects.get(token=game_token)
        except Game.DoesNotExist:
            return None

    @database_sync_to_async
    def db_msg_save(self, user, room, message, time):
        Message.objects.create(text=message, created_at=time, user=user, room=room)

    @database_sync_to_async
    def db_channel_add(self, user, channel):
        if user.is_authenticated:
            Channel.objects.create(user=user, channel=channel)

    @database_sync_to_async
    def db_channel_del(self, user, channel):
        Channel.objects.filter(channel=channel).delete()

    @database_sync_to_async
    def db_channel_touch(self, user, channel):
        Channel.objects.filter(pk=channel).update(last_seen=timezone.now())

    def user_to_group(self, user_id):
        return f"user_{user_id}"

    def room_to_group(self, room_id):
        return f"room_{room_id}"

    @property
    def username(self):
        user = self.scope.get('user', None)

        if user is None or not user.is_authenticated:
            return '[anonymous]'
        else:
            return user.login

    async def connect(self):
        print('websocket connect event')
        print(f'    path  : {self.scope["path"]}')
        if b'x-real-ip' in dict(self.scope['headers']):
            print(f'    client: {dict(self.scope["headers"])[b"x-real-ip"].decode("ascii")}')
        else:
            print(f'    client: {self.scope["client"][0]}')
        user = self.scope.get('user', None)

        # Check if the user is logged in, otherwise, disable the chat.
        #if self.scope["user"].is_anonymous:
        #    await self.close()

        await self.accept()

        # For authenticated users, we create a channel group for private
        # messaging.  A group is used because there can be multiple websocket
        # connections for the same user.
        if user is not None and user.is_authenticated:
            group = self.user_to_group(user.id)
            await self.channel_layer.group_add(
                group,
                self.channel_name
            )
            print(f"    {self.username}/{self.channel_name} joined broadcast group {group}")

        await self.db_channel_add(user, self.channel_name)

    async def disconnect(self, close_code):
        user = self.scope.get('user', None)

        for game_token in self._games:
            group = f'game_{game_token}'
            await self.channel_layer.group_discard(
                group,
                self.channel_name
            )
            print(f"    {self.username}/{self.channel_name} left broadcast group {group}")
        self._games = set()

        for room_id in list(self._rooms):
            await self.room_leave(room_id, room_id)

        # Depart from the private messaging broadcast group.
        if user is not None and user.is_authenticated:
            group = self.user_to_group(user.id)
            await self.channel_layer.group_discard(
                group,
                self.channel_name
            )
            print(f"    {self.username}/{self.channel_name} left broadcast group {group}")

        await self.db_channel_del(user, self.channel_name)

    async def receive_json(self, data):
        # Update Channel.last_seen when we receive data on this channel.
        user = self.scope.get('user', None)
        if user is not None and user.is_authenticated:
            await self.db_channel_touch(user, self.channel_name)

        print(f'receive_json {data}')
        if 'stream' not in data or 'payload' not in data:
            return await self.close()

        stream  = data['stream']
        payload = data['payload']

        if 'method' not in payload or 'arguments' not in payload:
            return await self.close()

        # See if we have a handler for the requested method.
        method = self._methods[payload['method']]
        if method is None:
            return await self.close()

        # Handle the request.
        return await method(stream, **payload['arguments'])

    async def match_request(self, stream, target_user_id):
        user = self.scope.get('user', None)
        if user is None or not user.is_authenticated:
            return None

        # We cannot ask ourselves for a match.
        if user.id == target_user_id:
            return None

        # Make sure the target user exists.
        target_user = await self.db_user_get(target_user_id)
        if target_user is None:
            return None

        match_request = {
            'proposed_by_id': user.id
        }

        response = {
            'type'         : 'match_requested',
            'html'         : '<h1>kak</h1>',
            'game_token'   : 123,
            'match_request': match_request
        }
        await room_xmit_event({'stream': stream, 'payload': response})

    async def game_join(self, stream, game_token):
        print('game_join event')
        print(f'    user : {self.username}')
        print(f'    token: {game_token}')

        user = self.scope.get('user', None)
        game = await self.db_game_get(game_token)

        if game is None: return

        # Create a new channel for the room by converting its name to a group
        # name and adding it.
        group = f'game_{game_token}'
        await self.channel_layer.group_add(
            group,
            self.channel_name
        )
        self._games.add(game_token)
        print(f"    {self.username}/{self.channel_name} joined broadcast group {group}")

        response = {
            'method': 'game_join',
            'status': 'success'
        }

        await self.channel_layer.send(self.channel_name, {
            'type'   : 'room.xmit.event',
            'stream' : stream,
            'payload': response
        })

    async def room_join(self, stream, room_id):
        print(f"room_join[{stream}, {room_id}]")
        user  = self.scope.get('user', None)
        room  = await self.get_room(room_id)

        # If we don't have this room in our database, we bail.
        if room is None:
            return

        # Debug log.
        print("    {} joined room {}".format(self.username, room_id))

        # Create a new channel for the room by converting its name to a group
        # name and adding it.
        group = f"room_{room.id}"
        await self.channel_layer.group_add(
            group,
            self.channel_name
        )
        print(f"    {self.username}/{self.channel_name} joined broadcast group {group}")

        # For authenticated users, we also create a room scoped privmsg group.
        if user is not None and user.is_authenticated:
            group = f"room_{room_id}_user_{user.id}"
            await self.channel_layer.group_add(
                group,
                self.channel_name
            )
            print(f"    {self.username}/{self.channel_name} joined broadcast group {group}")

        # Keep track of this room in our set of rooms.
        self._rooms.add(room_id)

        # If we don't have a user context, or an anonymous one, we're done
        # here.  This is to ensure users can view rooms without actually
        # having signed in.
        if user is None or not user.is_authenticated:
            return

        # Flag in the database which room the current user joined, and create
        # an event message.  We don't announce our arrival if we have multiple
        # connections to this room.
        if await self.db_room_user_add(room, user, self.channel_name) > 1:
            print(f"    {user.login} is in room_{room.id} more than once.")
            return

        # Notify everyone in the group we arrived.
        response = {
            'action'    : 'user_arrive',
            'id'        : user.id,
            'login'     : user.login,
            'avatar_pic': user.avatar_pic,
            'user_type' : user.user_type,
            'rank'      : user.rank,
            'available' : user.available,
        }

        group = f"room_{room.id}"
        print(f"    user_arrive -> {group}")
        await self.channel_layer.group_send(group, {
            'type'   : 'room.xmit.event',
            'stream' : stream,
            'payload': response
        })

    async def room_list(self, stream, room_id):
        # We cannot list a room we haven't joined.
        if room_id not in self._rooms:
            return None

        user  = self.scope.get('user', None)
        group = self.room_to_group(room_id)
        room  = await self.get_room(room_id)

        # XXX: special case database deleted rooms.
        if room is None:
            return None

        # Get the list of users from the database.  This is in a format
        # that can directly be JSON serialized.
        room_users = list(await self.db_list_room(room))

        response = {
            'action': 'room_list',
            'list'  : room_users
        }
        await self.room_xmit_event({ 'stream': stream, 'payload': response })

    async def room_leave(self, stream, room_id):
        # We cannot leave a room we haven't joined.
        if room_id not in self._rooms:
            return None

        user  = self.scope.get('user', None)
        group = self.room_to_group(room_id)
        room  = await self.get_room(room_id)

        # XXX: special case database deleted rooms.
        if room is None:
            return None

        # Debug log.
        print("[room] '{}' left '{}'".format(self.username, room_id))

        # If we are a valid authenticated user, we broadcast a part
        # notification to everyone in the room.
        if user and user.is_authenticated:
            # See if we have the room completely, if so, notify.
            if await self.db_room_user_del(room, user, self.channel_name) == 0:
                response = {
                    'action'    : 'user_leave',
                    'id'        : user.id,
                    'login'     : user.login,
                    'avatar_pic': user.avatar_pic,
                    'rank'      : user.rank
                }

                # Notify everyone in the group we departed.
                await self.channel_layer.group_send(group, {
                    'type'   : 'room.xmit.event',
                    'stream' : stream,
                    'payload': response
                })

            privmsg_group = f"room_{room_id}_user_{user.id}"
            await self.channel_layer.group_discard(
                privmsg_group,
                self.channel_name
            )
            print(f"    {self.username}/{self.channel_name} left broadcast group {privmsg_group}")

        await self.channel_layer.group_discard(
            group,
            self.channel_name
        )
        print(f"    {self.username}/{self.channel_name} left broadcast group {group}")
        self._rooms.remove(room_id)

    async def room_chat(self, stream, room_id, msg):
        # We cannot chat in a room we haven't joined.
        if room_id not in self._rooms:
            return None

        user  = self.scope.get('user', None)
        group = self.room_to_group(room_id)

        # Non-registered users aren't allowed to send messages.
        if not user or not user.is_authenticated:
            return

        # See if this room is present in the database.
        room = await self.get_room(room_id)
        if room is None:
            return

        print("[room] chat in room {}: '{}'".format(room_id, msg))

        user      = self.scope['user']
        timestamp = timezone.now()
        await self.db_msg_save(user, room, msg, timestamp)

        response = {
            'action': 'chat',
            'msg'   : {
                'created_at': timestamp.strftime('%Y-%m-%dT%H:%M:%SZ'),
                'user': user.login,
                'text': html.escape(msg)
            }
        }

        # Relay the message to everyone in the group, including ourselves.
        await self.channel_layer.group_send(group, {
            'type'   : 'room.xmit.event',
            'stream' : stream,
            'payload': response
        })

    async def room_xmit_event(self, event):
        print("xmit:", event)
        await self.send_json({
            'stream' : event['stream'],
            'payload': event['payload']
        })
