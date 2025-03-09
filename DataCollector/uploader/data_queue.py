# DataCollector/uploader/data_queue.py
import pickle
import os
import logging
from queue import Queue

logger = logging.getLogger(__name__)

class DataQueue:
    def __init__(self, cache_file='data_queue_cache.pkl'):
        self.queue = Queue()
        self.cache_file = cache_file
        self.load_queue()

    def add_data(self, data):
        self.queue.put(data)
        self.save_queue()

    def get_data(self):
        if not self.queue.empty():
            data = self.queue.get()
            self.save_queue()
            return data
        return None

    def get_size(self):
        return self.queue.qsize()

    def save_queue(self):
        with open(self.cache_file, 'wb') as f:
            pickle.dump(list(self.queue.queue), f)
        logger.info(f"Queue saved to {self.cache_file}")

    def load_queue(self):
        if os.path.exists(self.cache_file):
            with open(self.cache_file, 'rb') as f:
                data_list = pickle.load(f)
                for data in data_list:
                    self.queue.put(data)
            logger.info(f"Queue loaded from {self.cache_file}")