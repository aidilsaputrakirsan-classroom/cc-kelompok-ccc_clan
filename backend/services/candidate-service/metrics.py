import time


class Metrics:

    def __init__(self):
        self.start_time = time.time()
        self.total_requests = 0
        self.total_errors = 0

    def record_request(
        self,
        status_code
    ):

        self.total_requests += 1

        if status_code >= 400:
            self.total_errors += 1

    def get_metrics(self):

        error_rate = 0

        if self.total_requests > 0:

            error_rate = round(
                self.total_errors
                /
                self.total_requests
                * 100,
                2
            )

        return {
            "uptime_seconds":
                round(
                    time.time()
                    -
                    self.start_time,
                    2
                ),

            "total_requests":
                self.total_requests,

            "total_errors":
                self.total_errors,

            "error_rate_percent":
                error_rate
        }


metrics = Metrics()