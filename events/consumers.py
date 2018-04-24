from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from rooms.models import Room, Message

class TestConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._rooms   = set()

        self._methods = {
            'room_join' : self.room_join,
            'room_leave': self.room_leave,
            'room_chat' : self.room_chat
        }

    @database_sync_to_async
    def set_room(self, user, room):
        if user.is_authenticated:
            user.room = room
            user.save()

    @database_sync_to_async
    def get_room(self, room_id):
        try:
            room = Room.objects.get(pk=room_id)
        except Room.DoesNotExist:
            return None
        return room

    @database_sync_to_async
    def db_msg_save(self, user, room, message, time):
        Message.objects.create(text=message, created_at=time, user=user, room=room)

    def room_to_group(self, room_id):
        return "room_{}".format(room_id)

    async def connect(self):
        print('connect')
        # Check if the user is logged in, otherwise, disable the chat.
        #if self.scope["user"].is_anonymous:
        #    await self.close()

        await self.accept()

    async def disconnect(self, close_code):
        for room_id in list(self._rooms):
            await self.room_leave(room_id, room_id)

    async def receive_json(self, data):
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

    async def room_join(self, stream, room_id):
        user  = self.scope.get('user', None)
        group = self.room_to_group(room_id)
        room  = await self.get_room(room_id)

        # If we don't have this room in our database, we bail.
        if room is None:
            return

        # Debug log.
        if user is None or not user.is_authenticated:
            username = '[anonymous]'
        else:
            username = user.login
        print("[room] '{}' joined room {}".format(username, room_id))

        # Create a new channel for the room by converting its name to a group
        # name and adding it.
        await self.channel_layer.group_add(
            group,
            self.channel_name
        )

        # Keep track of this room in our set of rooms.
        self._rooms.add(room_id)

        # If we don't have a user context, or an anonymous one, we're done
        # here.  This is to ensure users can view rooms without actually
        # having signed in.
        if user is None or not user.is_authenticated:
            return

        # Flag in the database which room the current user joined, and create
        # an event message.
        await self.set_room(user, room)


        # Notify everyone in the group we arrived.
        response = {
            'action'    : 'user_arrive',
            'id'        : user.id,
            'login'     : user.login,
            'avatar_pic': user.avatar_pic,
            'rank'      : user.rank
        }
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

    async def room_leave(self, stream, room_id):
        user  = self.scope.get('user', None)
        group = self.room_to_group(room_id)
        room  = await self.get_room(room_id)

        if room is None:
            return None

        print("[room] leave '{}'".format(room_id))

        # If we are a valid authenticated user, we broadcast a part
        # notification to everyone in the room.
        if user and user.is_authenticated:
            await self.set_room(user, None)
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

        # Depart from the broadcast group.
        await self.channel_layer.group_discard(
            group,
            self.channel_name
        )
        self._rooms.remove(room_id)

    async def room_chat(self, stream, room_id, msg):
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
                'text': msg
            }
        }

        # Relay the message to everyone in the group, including ourselves.
        await self.channel_layer.group_send(group, {
            'type'   : 'room.xmit.event',
            'stream' : stream,
            'payload': response
        })