from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "NASA Mission Control API is live"}