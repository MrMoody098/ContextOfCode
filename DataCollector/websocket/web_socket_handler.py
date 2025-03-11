import asyncio
import websockets
import logging
import subprocess
from config import config

class WebSocketHandler:
    def __init__(self):
        self.host = config.server.host
        self.port = config.server.port
        self.spotify_path = config.spotify.path  # Get Spotify path from the config

    async def handle_connection(self, websocket):
        logging.info(f"Connection opened from {websocket.remote_address}")
        try:
            async for message in websocket:
                logging.info(f"Received message: {message}")
                if message == "open_spotify":
                    # Open Spotify using the path from the config
                    logging.info("Triggering Spotify opening.")
                    await self.open_spotify()
                    await websocket.send("Spotify opened successfully.")
        except Exception as e:
            logging.error(f"Error during connection: {e}")
        finally:
            logging.info(f"Connection from {websocket.remote_address} closed.")

    def start_server(self):
        # Use asyncio.run to run the WebSocket server in the main thread
        asyncio.run(self._start_server())

    async def _start_server(self):
        # This will ensure the event loop is running
        server = await websockets.serve(self.handle_connection, self.host, self.port)
        await server.wait_closed()

    def open_spotify(self):
        """Open Spotify using the path from the config."""
        try:
            subprocess.Popen(self.spotify_path)
            logging.info(f"Spotify opened from {self.spotify_path}")
        except Exception as e:
            logging.error(f"Failed to open Spotify: {e}")

