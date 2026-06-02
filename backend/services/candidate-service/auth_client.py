import httpx
from fastapi import Header, HTTPException

AUTH_SERVICE_URL = "http://auth-service:8001"


async def verify_token(
    authorization: str = Header(...)
):
    async with httpx.AsyncClient() as client:

        response = await client.get(
            f"{AUTH_SERVICE_URL}/verify",
            headers={
                "Authorization": authorization
            }
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    return response.json()