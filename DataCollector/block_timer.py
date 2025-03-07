import time
import logging

logger = logging.getLogger(__name__)

class BlockTimer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end = time.perf_counter()
        elapsed_time = self.end - self.start
        logger.info(f"Code block executed in: {elapsed_time:.4f} seconds")