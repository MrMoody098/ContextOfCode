# DataCollector/queue_system.py
import queue
import logging

logger = logging.getLogger(__name__)

class DataQueue:
    def __init__(self):
        self.queue = queue.Queue()
        logger.info("DataQueue initialized")

    def add_data(self, data):
        self.queue.put(data)
        logger.info(f"Data added to queue: {data}")

    def get_data(self):
        if not self.queue.empty():
            data = self.queue.get()
            logger.info(f"Data retrieved from queue: {data}")
            return data
        logger.info("Queue is empty")
        return None

    def get_size(self):
        size = self.queue.qsize()
        logger.info(f"Current Queue size: {size}")
        return size
