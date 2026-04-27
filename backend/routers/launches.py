from fastapi import APIRouter
import httpx

router = APIRouter()

@router.get("/launches")
async def get_launches():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10&format=json"
        )
        data = response.json()
        launches = []
        for launch in data["results"]:
            launches.append({
                "id": launch["id"],
                "name": launch["name"],
                "status": launch["status"]["name"],
                "net": launch["net"],
                "mission": launch["mission"]["description"] if launch["mission"] else "No description available",
                "pad": launch["pad"]["name"],
                "location": launch["pad"]["location"]["name"],
                "image": launch["image"],
            })
        return launches