import datetime
from dataclasses import dataclass
from typing import Optional

@dataclass
class DataSnapshot:
    """Class to represent a data frame."""

    device: str
    metric: str
    timestamp: datetime
    value: float
    unit: Optional[str] = None

    # Serialised data
    def serialize(self):
        """Serialise the data frame."""
        return self.__dict__