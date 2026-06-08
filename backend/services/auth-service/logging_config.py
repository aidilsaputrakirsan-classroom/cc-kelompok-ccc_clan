import json
import logging
import sys
import os

from datetime import datetime, timezone

SERVICE_NAME = os.getenv(
    "SERVICE_NAME",
    "unknown"
)

LOG_LEVEL = os.getenv(
    "LOG_LEVEL",
    "INFO"
)


class JSONFormatter(logging.Formatter):

    def format(self, record):

        log_entry = {
            "timestamp": datetime.now(
                timezone.utc
            ).isoformat(),

            "level": record.levelname,
            "service": SERVICE_NAME,
            "logger": record.name,
            "message": record.getMessage()
        }

        if hasattr(record, "correlation_id"):
            log_entry["correlation_id"] = (
                record.correlation_id
            )

        if hasattr(record, "method"):
            log_entry["method"] = record.method

        if hasattr(record, "path"):
            log_entry["path"] = record.path

        if hasattr(record, "status_code"):
            log_entry["status_code"] = (
                record.status_code
            )

        if hasattr(record, "duration_ms"):
            log_entry["duration_ms"] = (
                record.duration_ms
            )

        return json.dumps(log_entry)


def setup_logging():

    root_logger = logging.getLogger()

    root_logger.setLevel(
        getattr(logging, LOG_LEVEL)
    )

    root_logger.handlers.clear()

    handler = logging.StreamHandler(
        sys.stdout
    )

    handler.setFormatter(
        JSONFormatter()
    )

    root_logger.addHandler(
        handler
    )

    return root_logger