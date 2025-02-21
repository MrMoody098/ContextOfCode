# main.py
import time
import logging
from data.metrics_handler import Metrics
from data.metric import CPUUtilization, CPUTimes, BTCPrice, SOLPrice
from logger import setup_logger

class Main:
    def __init__(self, device: str):
        self.device = device
        self.metrics = Metrics(device)
        self.setup_metrics()

    def setup_metrics(self):
        self.metrics.add_metric(CPUUtilization())
        self.metrics.add_metric(CPUTimes())
        # self.metrics.add_metric(BTCPrice(symbol="BTC"))
        # self.metrics.add_metric(SOLPrice())

    def log_metrics(self):
        while True:
            data_snapshots = self.metrics.measure_metrics()
            for snapshot in data_snapshots:
                logging.info(snapshot.serialize())
            time.sleep(5)

if __name__ == "__main__":
    setup_logger()
    main = Main(device="device_123")
    main.log_metrics()