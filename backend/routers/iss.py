from fastapi import APIRouter
import httpx

router = APIRouter()

@router.get("/iss-location")
async def get_iss_location():
    async with httpx.AsyncClient() as client:
        response = await client.get("http://api.open-notify.org/iss-now.json")
        data = response.json()
        return {
            "latitude": float(data["iss_position"]["latitude"]),
            "longitude": float(data["iss_position"]["longitude"]),
            "timestamp": data["timestamp"]
        }