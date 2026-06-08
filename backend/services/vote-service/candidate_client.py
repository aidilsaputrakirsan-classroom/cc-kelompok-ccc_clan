import os
import httpx


CANDIDATE_SERVICE_URL = os.getenv(
    "CANDIDATE_SERVICE_URL",
    "http://candidate-service:8002"
)


async def get_candidate(
    candidate_id: int
):

    async with httpx.AsyncClient() as client:

        response = await client.get(
            f"{CANDIDATE_SERVICE_URL}/candidates/{candidate_id}"
        )

    if response.status_code != 200:
        return None

    return response.json()