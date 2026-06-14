import uuid
import time
import logging

from starlette.middleware.base import (
    BaseHTTPMiddleware
)

from metrics import metrics

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(
    BaseHTTPMiddleware
):

    async def dispatch(
        self,
        request,
        call_next
    ):

        correlation_id = request.headers.get(
            "X-Correlation-ID",
            str(uuid.uuid4())[:12]
        )

        request.state.correlation_id = (
            correlation_id
        )

        start_time = time.time()

        try:

            response = await call_next(
                request
            )

        except Exception:

            logger.exception(
                "Unhandled exception",
                extra={
                    "correlation_id":
                        correlation_id
                }
            )

            raise

        duration_ms = round(
            (
                time.time()
                -
                start_time
            ) * 1000,
            2
        )

        metrics.record_request(
            response.status_code
        )

        logger.info(
            f"{request.method} {request.url.path}",
            extra={
                "correlation_id":
                    correlation_id,

                "method":
                    request.method,

                "path":
                    request.url.path,

                "status_code":
                    response.status_code,

                "duration_ms":
                    duration_ms
            }
        )

        response.headers[
            "X-Correlation-ID"
        ] = correlation_id

        return response