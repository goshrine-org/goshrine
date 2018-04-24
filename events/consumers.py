from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from rooms.models import Room

class TestConsumer(AsyncJsonWebsocketConsumer):
    @database_sync_to_async
    def set_room(self, user, room):
        print("SET ROOM", type(user))
        user.room = room
        user.save()

    @database_sync_to_async
    def get_room(self, room):
        room_id = int(room.split('/')[-1])
        try:
            room = Room.objects.get(pk=room_id)
        except Room.DoesNotExist:
            return None
        return room

    async def connect(self):
        print('connect')
        # Check if the user is logged in, otherwise, disable the chat.
        #if self.scope["user"].is_anonymous:
        #    await self.close()

        await self.accept()

        self._channels = {
            '/meta/subscribe': (self.subscribe, ['subscription'])
        }

    async def disconnect(self, close_code):
        for channel in self._channels.keys():
            print('disconnecting', channel)
            await self.unsubscribe(channel)

    async def receive_json(self, data):
        # Someone is messing around, so close the websocket.
        if 'channel' not in data:
            return await self.close()

        # If this is an unknown channel, close things.
        if data['channel'] not in self._channels:
            return await self.close()

        method, arguments = self._channels[data['channel']]

        try:
            args = [data[argument] for argument in arguments]
        except KeyError:
            return await self.close()

        return await method(*args)

    def _channel_to_group(self, subscription):
        return subscription.replace('/', '.')

    async def subscribe(self, subscription):
        room = None
        if subscription.startswith('/room/'):
            room = await self.get_room(subscription)
            # XXX: error
            if room is None:
                return None

        print("subscribed to '{}'".format(subscription))
        group = self._channel_to_group(subscription)
        self._channels[subscription] = self.channel_handler
        await self.channel_layer.group_add(
            group,
            self.channel_name
        )

        user = self.scope['user']
        if room is not None: await self.set_room(user, room)
        response = {
            'action'    : 'user_arrive',
            'id'        : user.id,
            'login'     : user.login,
            'avatar_pic': user.avatar_pic,
            'rank'      : user.rank
        }

        # Notify everyone in the group we arrived.
        await self.channel_layer.group_send(group, {
            'type'   : 'user.arrive',
            'stream' : subscription,
            'payload': response
        })

    async def user_arrive(self, event):
        await self.send_json({
            'stream' : event['stream'],
            'payload': event['payload']
        })

    async def unsubscribe(self, subscription):
        room = None
        if subscription.startswith('/room/'):
            room = await self.get_room(subscription)
            # XXX: error
            if room is None:
                return None

        print("unsubscribing from {}".format(subscription))
        group = self._channel_to_group(subscription)

        user = self.scope['user']
        if room is not None: await self.set_room(user, None)
        response = {
            'action'    : 'user_leave',
            'id'        : user.id,
            'login'     : user.login,
            'avatar_pic': user.avatar_pic,
            'rank'      : user.rank
        }

        # Notify everyone in the group we departed.
        await self.channel_layer.group_send(group, {
            'type'   : 'user.leave',
            'stream' : subscription,
            'payload': response
        })

        # And depart from the group.
        await self.channel_layer.group_discard(
            group,
            self.channel_name
        )

    async def user_leave(self, event):
        await self.send_json({
            'stream' : event['stream'],
            'payload': event['payload']
        })

    async def channel_handler(self, data):
        print(data)
