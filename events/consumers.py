from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from rooms.models import Room

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
        user.room = room
        user.save()

    @database_sync_to_async
    def get_room(self, room_id):
        try:
            room = Room.objects.get(pk=room_id)
        except Room.DoesNotExist:
            return None
        return room

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
        print("JSON:", data)
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
        room = await self.get_room(room_id)
        if room is None:
            return None

        print(type(room_id), type(stream))
        print("[room] join '{}'".format(room_id))

        # Create a new channel for the room by converting its name to a group
        # name and adding it.
        group = self.room_to_group(room_id)
        await self.channel_layer.group_add(
            group,
            self.channel_name
        )

        # Flag in the database which room the current user joined, and create
        # an event message.
        user = self.scope['user']
        await self.set_room(user, room)
        self._rooms.add(room_id)

        response = {
            'action'    : 'user_arrive',
            'id'        : user.id,
            'login'     : user.login,
            'avatar_pic': user.avatar_pic,
            'rank'      : user.rank
        }

        # Notify everyone in the group we arrived.
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
        room = await self.get_room(room_id)
        if room is None:
            return None

        print("[room] leave '{}'".format(room_id))

        user = self.scope['user']
        await self.set_room(user, None)
        response = {
            'action'    : 'user_leave',
            'id'        : user.id,
            'login'     : user.login,
            'avatar_pic': user.avatar_pic,
            'rank'      : user.rank
        }

        # Notify everyone in the group we departed.
        group = self.room_to_group(room_id)
        await self.channel_layer.group_send(group, {
            'type'   : 'room.xmit.event',
            'stream' : stream,
            'payload': response
        })

        # And depart from the group.
        await self.channel_layer.group_discard(
            group,
            self.channel_name
        )
        self._rooms.remove(room_id)

    async def room_chat(self, stream, room_id, msg):
        room = await self.get_room(room_id)
        if room is None:
            return None

        print(type(stream), type(room_id))
        print("[room] chat in room {}: '{}'".format(room_id, msg))

        user = self.scope['user']
        response = {
            'action': 'chat',
            'msg'   : {
                'created_at': timezone.now().strftime('%Y-%m-%dT%H:%M:%SZ'),
                'user': user.login,
                'text': msg
            }
        }

        # Relay the message to everyone in the group, including ourselves.
        group = self.room_to_group(room_id)
        await self.channel_layer.group_send(group, {
            'type'   : 'room.xmit.event',
            'stream' : stream,
            'payload': response
        })
