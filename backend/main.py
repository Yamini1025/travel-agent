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
from gemini_client import generate_itinerary

app = FastAPI()


class TripRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    adults: int
    children: int
    budget: str
    dietary_preferences: List[str]
    attraction_preferences: List[str]
    preferences: str

@app.post("/api/trips")
def create_trip(trip: TripRequest):
    flights = search_flights(
        trip.destination,
        trip.start_date,
        trip.end_date
    )

    hotels = search_hotels(
        trip.destination,
        trip.start_date,
        trip.end_date
    )

    attractions = search_attractions(
        trip.destination,
        trip.attraction_preferences
    )

    restaurants = search_restaurants(
        trip.destination,
        trip.dietary_preferences
    )

    search_results = {
        "flights": flights,
        "hotels": hotels,
        "attractions": attractions,
        "restaurants": restaurants
    }

    itinerary = generate_itinerary(
        trip.model_dump(), # convert TripRequest object into a regular Python dictionary
        search_results
    )

    return {
        "success": True,
        "trip": trip.model_dump(),
        "itinerary": itinerary
    }

@app.get("/api/test-flights")
def test_flights():
    return search_flights("LGB", "2026-10-10", "2026-10-15")

@app.get("/api/test-hotels")
def test_hotels():
    return search_hotels("Anaheim, Disneyland", "2026-10-10", "2026-10-15")


@app.get("/api/test-attractions")
def test_attractions():
    return search_attractions("Anaheim, Disneyland", "thrill, roller coaster")


@app.get("/api/test-restaurants")
def test_restaurants():
    return search_restaurants("Anaheim, Disneyland", "vegetarian")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)