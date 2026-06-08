import time


class CircuitBreaker:

    def __init__(
        self,
        name,
        failure_threshold=5,
        cooldown_seconds=30
    ):

        self.name = name

        self.failure_threshold = (
            failure_threshold
        )

        self.cooldown_seconds = (
            cooldown_seconds
        )

        self.failure_count = 0

        self.last_failure_time = None

        self.state = "CLOSED"

    def can_execute(self):

        if self.state == "CLOSED":
            return True

        if self.state == "OPEN":

            elapsed = (
                time.time()
                -
                self.last_failure_time
            )

            if elapsed >= self.cooldown_seconds:

                self.state = "HALF_OPEN"

                return True

            return False

        return True

    def record_success(self):

        self.failure_count = 0

        self.state = "CLOSED"

    def record_failure(self):

        self.failure_count += 1

        self.last_failure_time = time.time()

        if (
            self.failure_count
            >=
            self.failure_threshold
        ):
            self.state = "OPEN"

    def get_status(self):

        return {
            "name": self.name,
            "state": self.state,
            "failure_count": self.failure_count
        }