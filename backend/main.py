from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import iss

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(iss.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "NASA Mission Control API is live"}