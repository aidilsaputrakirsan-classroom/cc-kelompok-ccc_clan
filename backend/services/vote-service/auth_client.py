import os
import asyncio
import httpx

from fastapi import Header, HTTPException

from circuit_breaker import CircuitBreaker


AUTH_SERVICE_URL = os.getenv(
    "AUTH_SERVICE_URL",
    "http://auth-service:8001"
)

MAX_RETRIES = 3
BASE_DELAY = 0.5
TIMEOUT_SECONDS = 5


auth_circuit = CircuitBreaker(
    name="auth-service",
    failure_threshold=5,
    cooldown_seconds=30
)


async def _call_auth_service(
    authorization: str
):

    if not auth_circuit.can_execute():

        raise HTTPException(
            status_code=503,
            detail="Auth Service unavailable (Circuit OPEN)"
        )

    for attempt in range(1, MAX_RETRIES + 1):

        try:

            async with httpx.AsyncClient() as client:

                response = await client.get(
                    f"{AUTH_SERVICE_URL}/verify",
                    headers={
                        "Authorization": authorization
                    },
                    timeout=TIMEOUT_SECONDS
                )

            if response.status_code == 200:

                auth_circuit.record_success()

                return response.json()

            if response.status_code == 401:

                auth_circuit.record_success()

                raise HTTPException(
                    status_code=401,
                    detail="Invalid token"
                )

        except (
            httpx.ConnectError,
            httpx.TimeoutException
        ):

            if attempt < MAX_RETRIES:

                delay = BASE_DELAY * (2 ** (attempt - 1))

                await asyncio.sleep(delay)

    auth_circuit.record_failure()

    raise HTTPException(
        status_code=503,
        detail="Auth Service unavailable"
    )


async def verify_token(
    authorization: str = Header(...)
):

    if not authorization.startswith("Bearer "):

        raise HTTPException(
            status_code=401,
            detail="Invalid Authorization Header"
        )

    return await _call_auth_service(
        authorization
    )