"""Metrics module. Collects data from the device and serializes the data."""
from abc import abstractmethod, ABC
import datetime
import psutil
import logging
import requests
import yfinance as yf
import GPUtil

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
        return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='milliseconds')

    @abstractmethod
    def measure(self):
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
    """Class to measure the CPU utilization."""
    UNIT: str = 'Percent'
    DEVICE: str = 'LocalPC'

    def measure(self):
        """Measure the CPU Utilization."""
        if (cache := super().measure()):
            return cache

        value: float = psutil.cpu_percent(interval=1)
        data: DataSnapshot = DataSnapshot(
            device=self.DEVICE,
            metric=self.get_metric_type(),
            timestamp=self.get_timestamp(),
            value=value,
            unit=self.UNIT
        )
        logger.debug(data)
        self.cache = (data, self.get_timestamp())
        return data


class GPUUtilization(Metric):
    """Class to measure GPU utilization."""
    UNIT: str = 'Percent'
    DEVICE: str = 'LocalPC'

    def measure(self) -> DataSnapshot:
        """Measure the GPU utilization."""
        if (cache := super().measure()):
            return cache

        # Use GPUtil to get GPU utilization
        gpus = GPUtil.getGPUs()
        if not gpus:
            raise RuntimeError("No GPU found")
        value: float = gpus[0].load * 100  # GPUtil returns load as a fraction
        data: DataSnapshot = DataSnapshot(
            device=self.DEVICE,
            metric=self.get_metric_type(),
            timestamp=self.get_timestamp(),
            value=value,
            unit=self.UNIT
        )
        logger.debug(data)
        self.cache = (data, self.get_timestamp())
        return data


class GPUTemp(Metric):
    """Class to measure GPU temperature."""
    UNIT: str = 'Celsius'
    DEVICE: str = 'LocalPC'

    def measure(self) -> DataSnapshot:
        """Measure the GPU temperature."""
        if (cache := super().measure()):
            return cache

        # Use GPUtil to get GPU temperature
        gpus = GPUtil.getGPUs()
        if not gpus:
            raise RuntimeError("No GPU found")
        value: float = gpus[0].temperature
        data: DataSnapshot = DataSnapshot(
            device=self.DEVICE,
            metric=self.get_metric_type(),
            timestamp=self.get_timestamp(),
            value=value,
            unit=self.UNIT
        )
        logger.debug(data)
        self.cache = (data, self.get_timestamp())
        return data


class BTCPrice(Metric):
    """Class to measure the cryptocurrency price using yfinance."""
    UNIT: str = 'EUR'  # This is the target currency, e.g., EUR
    DEVICE: str = 'CryptoAPI'

    def __init__(self, symbol: str):
        super().__init__()
        self.symbol = symbol  # The symbol (e.g., 'BTC', 'SOL')

    def measure(self) -> DataSnapshot:
        """Measure the cryptocurrency price using yfinance."""
        if (cache := super().measure()):
            return cache

        # Fetch data using yfinance
        try:
            ticker = yf.Ticker(self.symbol + '-EUR')  # Get the ticker for the pair (e.g., 'BTC-EUR')
            info = ticker.info

            # Get the current price directly
            if 'regularMarketPrice' not in info:
                logger.error(f"Price data not available for {self.symbol}")
                return None

            latest_price = info['regularMarketPrice']

            # Create and return the DataSnapshot object
            snapshot = DataSnapshot(
                device=self.DEVICE,
                metric=self.get_metric_type(),
                timestamp=self.get_timestamp(),
                value=latest_price,
                unit=self.UNIT
            )
            logger.debug(snapshot)
            self.cache = (snapshot, self.get_timestamp())
            return snapshot

        except Exception as e:
            logger.error(f"Error fetching price data for {self.symbol}: {e}")
            return None


class SOLPrice(BTCPrice):
    """Class to measure the SOL price."""
    def __init__(self):
        super().__init__('SOL')
