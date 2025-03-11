import logging
import time
import requests
import subprocess
import threading
from data.metrics_handler import Metrics
from data.metric import CPUUtilization, BTCPrice, SOLPrice, GPUTemp, GPUUtilization
from logger import setup_logger
from uploader.data_queue import DataQueue
from uploader.uploader_service import UploaderService
from config import config  # Import your config object


class Main:
    def __init__(self):
        # Initialize components
        self.metrics = Metrics()
        self.data_queue = DataQueue(cache_file="data_queue_cache.pkl")

        # UploaderService for sending metrics
        self.uploader_service = UploaderService(self.data_queue, config.uploader_api.endpoint)

        self.setup_metrics()
        logging.info("Main initialized")

    def setup_metrics(self):
        self.metrics.add_metric(CPUUtilization())
        self.metrics.add_metric(GPUTemp())
        self.metrics.add_metric(GPUUtilization())
        self.metrics.add_metric(BTCPrice(symbol="BTC"))
        self.metrics.add_metric(SOLPrice())
        logging.info("Metrics setup completed")

    def log_metrics(self):
        """Collects and logs system metrics periodically."""
        while True:
            data_snapshots = self.metrics.measure_metrics()
            for snapshot in data_snapshots:
                if snapshot is not None:
                    serialized_data = snapshot.serialize()
                    logging.info(serialized_data)
                    self.data_queue.add_data(serialized_data)
                else:
                    logging.error("Received None as snapshot, skipping serialization.")
            time.sleep(30)

    def check_for_commands(self):
        """Polls Spring Boot API for new commands and executes them."""
        while True:
            try:
                response = requests.get(f"{config.command_api.endpoint}/pending", timeout=5)
                if response.status_code == 200:
                    commands = response.json()

                    for command in commands:
                        if command["command"] == "open_spotify":
                            logging.info("Executing command: Open Spotify")
                            subprocess.Popen([r"C:\Users\ticta\AppData\Roaming\Spotify\Spotify.exe"])  # Adjust path if needed

                            # Mark command as executed
                            requests.put(f"{config.command_api.endpoint}/mark-executed/{command['id']}", timeout=5)

                time.sleep(5)  # Poll every 5 seconds

            except requests.exceptions.RequestException as e:
                logging.error(f"Error contacting API: {e}")
                time.sleep(10)  # Retry after a delay

if __name__ == "__main__":
    setup_logger()
    main = Main()

    # Start metric uploader thread
    uploader_thread = threading.Thread(target=main.uploader_service.upload_data, daemon=True)
    uploader_thread.start()

    # Start command polling in a separate thread
    command_thread = threading.Thread(target=main.check_for_commands, daemon=True)
    command_thread.start()

    # Start logging metrics
    main.log_metrics()
