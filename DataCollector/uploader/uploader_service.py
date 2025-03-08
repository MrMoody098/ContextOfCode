# DataCollector/uploader_service.py
import requests
import time
import logging

logger = logging.getLogger(__name__)

class UploaderService:
    def __init__(self, data_queue, api_url):
        self.data_queue = data_queue
        self.api_url = api_url

    def upload_data(self):
        while True:
            data = self.data_queue.get_data()
            if data:
                try:
                    response = requests.post(self.api_url, json=data)
                    response.raise_for_status()
                    logger.info(f"Data uploaded successfully: {data}")
                    logger.info(f"Queue size after upload: {self.data_queue.get_size()}")
                except requests.RequestException as e:
                    logger.error(f"Failed to upload data: {data}, error: {e}")
                    self.data_queue.add_data(data)  # Re-add data to queue for retry
                    logger.info(f"Queue size after re-adding data: {self.data_queue.get_size()}")
            time.sleep(5)  # Wait before checking the queue again