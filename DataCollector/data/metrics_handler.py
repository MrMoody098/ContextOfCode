import logging
from data.data_snapshot import DataSnapshot
from .metric import Metric

logger = logging.getLogger(__name__)

class Metrics:
    def __init__(self, device: str):
        self.device: str = device
        self.metrics: set[Metric] = set()
        logger.info(f"Metrics initialized for device: {device}")

    def add_metric(self, metric: Metric):
        self.metrics.add(metric)
        logger.info(f"Added metric: {metric.get_metric_type()}")

    def remove_metric(self, metric: Metric):
        self.metrics.remove(metric)
        logger.info(f"Removed metric: {metric.get_metric_type()}")

    def get_metrics(self):
        return [metric.get_metric_type() for metric in self.metrics]

    def measure_metrics(self) -> list[DataSnapshot]:
        list_data = []
        for metric in self.metrics:
            data = metric.measure(self.device)
            list_data.append(data)
            logger.info(f"Measured metric: {metric.get_metric_type()} with data: {data.serialize()}")
        return list_data

    def measure_metric(self, metric_type: str) -> DataSnapshot:
        for metric in self.metrics:
            if metric.get_metric_type() == metric_type.lower():
                data: DataSnapshot = metric.measure(self.device)
                logger.info(f"Measured specific metric: {metric_type} with data: {data.serialize()}")
                return data