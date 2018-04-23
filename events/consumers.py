import json
from channels.generic.http import AsyncHttpConsumer
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class TestConsumer(AsyncJsonWebsocketConsumer):
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
        print("subscribed to '{}'".format(subscription))
        group = self._channel_to_group(subscription)
        self._channels[subscription] = self.channel_handler
        await self.channel_layer.group_add(
            group,
            self.channel_name
        )

        user     = self.scope['user']
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
        print("unsubscribing from {}".format(subscription))
        group = self._channel_to_group(subscription)

        user     = self.scope['user']
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

class AsyncLongPollConsumer(AsyncHttpConsumer):
    async def handle(self, body):
        body = await self.decode_json(body.decode('utf-8'))

        await self.send_headers(headers=[
            ("Content-Type", "application/json"),
        ])
        # Headers are only sent after the first body event.
        # Set "more_body" to tell the interface server to not
        # finish the response yet:
        await self.send_body(b"", more_body=True)
        await self.receive(body)

    async def receive(self, data):
        print("RECV CALLED")
        pass

    async def sendx(self, data):
        data = await self.encode_json(data)
        print('sending:', data)
        await self.send_body(data, more_body=False)

    @classmethod
    async def decode_json(cls, text_data):
        return json.loads(text_data)

    @classmethod
    async def encode_json(cls, content):
        return json.dumps(content).encode('utf-8')

class AsyncCometConsumer(AsyncLongPollConsumer):
    async def receive(self, data):
        assert(len(data) == 1)
        data = data[0]

        if data['channel'] == '/meta/handshake':
            await self.handle_handshake(data)
        else:
            print('recv:', data)

    async def handle_handshake(self, data):
        response = [{
            'channel'                 : '/meta/handshake',
            'version'                 : '1.0',
            'minimumVersion'          : '0.9',
            'supportedConnectionTypes': ['long-polling'],
            'advice'                  : {'timeout': 60000, 'interval': 0},
            'id'                      : data['id']
        }]
        print('handshake:', data)
        await self.sendx(response)
