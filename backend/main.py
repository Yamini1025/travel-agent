from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from serpapi_client import (
    search_flights,
    search_hotels,
    search_attractions,
    search_restaurants,
    get_return_flight,
    validate_destination
)
from gemini_client import generate_itinerary, validate_preferences

app = FastAPI()

class PreferenceValidationRequest(BaseModel):
    dietary_preferences: List[str]
    attraction_preferences: List[str]
    preferences: str


class TripRequest(BaseModel):
    start_point: str
    destination: str
    start_date: str
    end_date: str
    trip_type: List[str]
    budget: str
    dietary_preferences: List[str]
    attraction_preferences: List[str]
    preferences: str

class ItineraryRequest(BaseModel):
    trip: dict
    selected_flight: dict
    selected_hotel: dict
    attractions: list
    restaurants: list

class DestinationRequest(BaseModel):
    destination: str

@app.post("/api/validate-destination")
def validate_destination_endpoint(data: DestinationRequest):
    is_valid = validate_destination(data.destination)
    return {"valid": is_valid}

@app.post("/api/validate-preferences")
def validate_trip_preferences(data: PreferenceValidationRequest):
    validation = validate_preferences(
        data.dietary_preferences,
        data.attraction_preferences,
        data.preferences
    )
    return {
        "success": True,
        "validation": validation
    }

@app.post("/api/trips")
def create_trip(trip: TripRequest):
    flights = search_flights(
        trip.start_point,
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

    return {
        "success": True,
        "trip": trip.model_dump(),
        "flights": flights,
        "hotels": hotels,
        "attractions": attractions,
        "restaurants": restaurants
    }

@app.post("/api/generate-itinerary")
def create_itinerary(data: ItineraryRequest):
    trip = data.trip
    selected_flight = data.selected_flight
    selected_hotel = data.selected_hotel
    attractions = data.attractions
    restaurants = data.restaurants

    return_flight = get_return_flight(
        trip["startPoint"],
        trip["destination"],
        trip["endDate"],
        selected_flight["airline"]
    )

    selected_flight["return_flight"] = return_flight

    search_results = {
        "flights": {
            "outbound": selected_flight,
            "return": return_flight
        },
        "hotel": selected_hotel,
        "attractions": attractions,
        "restaurants": restaurants
    }

    itinerary = generate_itinerary(
        trip,
        search_results
    )

    return {
        "success": True,
        "itinerary": itinerary
    }

@app.get("/api/test-flights")
def test_flights():
    return search_flights("Los Angeles", "2026-10-10", "2026-10-15")

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