import json
from channels.generic.http import AsyncHttpConsumer

class LongPollConsumer(AsyncHttpConsumer):
    async def handle(self, body):
        print("EVENT HANDLE")

        await self.send_headers(headers=[
            ("Content-Type", "application/json"),
        ])
        # Headers are only sent after the first body event.
        # Set "more_body" to tell the interface server to not
        # finish the response yet:
        await self.send_body(b"", more_body=True)

    async def chat_message(self, event):
        # Send JSON and finish the response:
        await self.send_body(json.dumps(event).encode("utf-8"))
