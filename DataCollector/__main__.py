import logging
import sys
import time
from data.metrics_handler import Metrics
from data.metric import CPUUtilization, BTCPrice, SOLPrice, GPUTemp, GPUUtilization
from logger import setup_logger
import threading
from uploader.data_queue import DataQueue
from uploader.uploader_service import UploaderService
from config import config  # Import your config object
from websocket.web_socket_handler import WebSocketHandler


class Main:
    def __init__(self):
        # Use config values to initialize components
        self.metrics = Metrics()
        self.data_queue = DataQueue(cache_file='data_queue_cache.pkl')
        self.uploader_service = UploaderService(self.data_queue, config.uploader_api.endpoint)
        self.setup_metrics()
        logging.info("Main initialized")

        # Configure the WebSocketHandler using config values
        self.websocket_handler = WebSocketHandler(host=config.server.host, port=config.server.port)

        # Start the WebSocket server in a separate thread to allow the main program to continue running
        threading.Thread(target=self.websocket_handler.start_server, daemon=True).start()

    def setup_metrics(self):
        self.metrics.add_metric(CPUUtilization())
        self.metrics.add_metric(GPUTemp())
        self.metrics.add_metric(GPUUtilization())
        self.metrics.add_metric(BTCPrice(symbol="BTC"))
        self.metrics.add_metric(SOLPrice())
        logging.info("Metrics setup completed")

    def log_metrics(self):
        while True:
            data_snapshots = self.metrics.measure_metrics()
            for snapshot in data_snapshots:
                if snapshot is not None:  # Only serialize if the snapshot is not None
                    serialized_data = snapshot.serialize()
                    logging.info(serialized_data)
                    self.data_queue.add_data(serialized_data)
                else:
                    logging.error("Received None as snapshot, skipping serialization.")
            time.sleep(10)


if __name__ == "__main__":
    setup_logger()
    main = Main()

    # Start the uploader service in a separate thread
    uploader_thread = threading.Thread(target=main.uploader_service.upload_data)
    uploader_thread.start()

    main.log_metrics()
