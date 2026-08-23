from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from serpapi_client import (
    search_flights,
    search_hotels,
    search_attractions,
    search_restaurants
)


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

@app.get("/api/test-searches")
def test_searches():
    return {
        "hotels": search_hotels("Tokyo", "2026-10-10", "2026-10-15"),
        "attractions": search_attractions("Tokyo", "anime, food"),
        "restaurants": search_restaurants("Tokyo", "anime, food")
    }

@app.get("/api/test-flights")
def test_flights():
    return search_flights("TYO", "2026-10-10")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)