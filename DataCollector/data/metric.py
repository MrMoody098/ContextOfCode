"""Metrics module. Collects data from the device and serializes the data"""
from abc import abstractmethod, ABC
import datetime
import psutil
import logging
import requests

from config import config
from data.data_snapshot import DataSnapshot

logger = logging.getLogger(__name__)


class Metric(ABC):
    """Abstract class for metrics."""
    DATA_INDEX = 0
    TIME_UPDATED_INDEX = 1

    def __init__(self):
        super().__init__()
        self.cache: tuple = (None, None)

    def __eq__(self, other_metric_type: str):
        """Check if the metric type is equal to another metric type."""
        return self.get_metric_type() == other_metric_type

    def __hash__(self):
        """Return the hash of the metric type."""
        return hash(self.get_metric_type())

    def get_metric_type(self):
        """Return the metric type."""
        return self.__class__.__name__.lower()

    def get_timestamp(self):
        """Return the current time in ISO 8601 format with timezone."""
        return datetime.datetime.now(datetime.timezone.utc).isoformat()

    @abstractmethod
    def measure(self, device: str) -> DataSnapshot:
        """Measure the metric."""
        if self.cache[self.DATA_INDEX] and self.cache[self.TIME_UPDATED_INDEX]:
            # Get time difference
            cache_time_str = self.cache[self.TIME_UPDATED_INDEX]
            cache_time = datetime.datetime.fromisoformat(cache_time_str)
            current_time = datetime.datetime.now(datetime.timezone.utc)
            cache_age = current_time - cache_time

            if cache_age <= datetime.timedelta(minutes=config.third_party_api.cache_timeout_m):
                logger.debug('Returning cached data')
                return self.cache[self.DATA_INDEX]
            else:
                logger.debug('Cache expired')
                return None

class CPUUtilization(Metric):
    """Class to measure the CPU utilisation."""
    UNIT: str = 'Percent'

    def measure(self, device: str):
        """Measure the CPU Utilisation."""
        if (cache := super().measure(device)):
            return cache

        value: float = psutil.cpu_percent(interval=1)
        data: DataSnapshot = DataSnapshot(
            device=device,
            metric=self.get_metric_type(),
            timestamp=self.get_timestamp(),
            value=value,
            unit=self.UNIT
        )
        logger.debug(data)
        self.cache = (data, self.get_timestamp())
        return data

class CPUTimes(Metric):
    """Class to measure cpu times in user mode."""
    UNIT: str = 'Seconds'

    def measure(self, device: str) -> DataSnapshot:
        """Measure the CPU user times."""
        if (cache := super().measure(device)):
            return cache

        value: float = psutil.cpu_times().user
        data: DataSnapshot = DataSnapshot(
            device=device,
            metric=self.get_metric_type(),
            timestamp=self.get_timestamp(),
            value=value,
            unit=self.UNIT
        )
        logger.debug(data)
        self.cache = (data, self.get_timestamp())
        return data


class BTCPrice(Metric):
    """Class to measure the cryptocurrency price."""
    UNIT: str = 'USD'

    def __init__(self, symbol: str):
        super().__init__()
        self.symbol = symbol

    def measure(self, device: str) -> DataSnapshot:
        """Measure the cryptocurrency price."""
        if (cache := super().measure(device)):
            return cache

        url = f"http://api.coinlayer.com/live?access_key={config.third_party_api.url}&target=EUR&symbols={self.symbol}"
        response = requests.get(url)
        value: float = response.json()['rates'][self.symbol]
        data: DataSnapshot = DataSnapshot(
            device=device,
            metric=self.get_metric_type(),
            timestamp=self.get_timestamp(),
            value=value,
            unit=self.UNIT
        )
        logger.debug(data)
        self.cache = (data, self.get_timestamp())
        return data

class SOLPrice(BTCPrice):
    """Class to measure the SOL price."""
    def __init__(self):
        super().__init__('SOL')