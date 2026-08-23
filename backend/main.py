from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from serpapi_client import search_google


app = FastAPI()


class TripRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    adults: int
    children: int
    budget: str
    interests: List[str]
    preferences: str

@app.post("/api/trips")
def create_trip(trip: TripRequest):
    return {
        "success": True,
        "trip": trip
    }

@app.get("/api/test-search")
def test_search():
    results = search_google("best hotels in Tokyo")
    return results

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)