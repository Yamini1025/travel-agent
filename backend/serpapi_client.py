import os
from dotenv import load_dotenv
import serpapi

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")


def search_flights(destination, start_date, end_date):
    try :
        results = serpapi.search({
            "engine": "google_flights",
            "departure_id": "SFO",
            "arrival_id": destination,
            "type" : "1",
            "outbound_date": start_date,
            "return_date": end_date,
            "api_key": SERPAPI_KEY,
        })

        flights = results.get("best_flights", [])

        if not flights:
            return []

        return [
            {
                "price": flight.get("price"),
                "airline": flight.get("flights", [{}])[0].get("airline"),
                "total_duration_minutes": flight.get("total_duration"),
                "stops": len(flight.get("layovers", [])),
                "departure": flight.get("flights", [{}])[0]
                    .get("departure_airport", {}).get("time"),
                "arrival": flight.get("flights", [{}])[-1]
                    .get("arrival_airport", {}).get("time"),
                "departure_airport": flight.get("flights", [{}])[0]
                    .get("departure_airport", {}).get("id"),
                "arrival_airport": flight.get("flights", [{}])[-1]
                    .get("arrival_airport", {}).get("id")
            }
            for flight in flights
        ]
    except Exception as e:
        print(f"Flight search error: {e}")
        return []

def search_hotels(destination, start_date, end_date):
    try:
        results = serpapi.search({
            "engine": "google_hotels",
        "q": destination,
        "check_in_date": start_date,
        "check_out_date": end_date,
        "api_key": SERPAPI_KEY,
        })

        hotels = results.get("properties", [])

        if not hotels:
            return []

        return [
            {
                "name": hotel.get("name"),
                "description": hotel.get("description"),
                "price_per_night": hotel.get("rate_per_night", {}).get("extracted_lowest"),
                "total_price": hotel.get("total_rate", {}).get("extracted_lowest"),
                "rating": hotel.get("overall_rating"),
                "hotel_class": hotel.get("extracted_hotel_class"),
                "location": hotel.get("nearby_places", []),
                "link": hotel.get("link")
            }
            for hotel in hotels
        ]
    except Exception as e:
        print(f"Hotel search error: {e}")
        return []

def search_attractions(destination, attraction_preferences=None):
    if attraction_preferences:
        preferences = ", ".join(attraction_preferences)
        query = f"best {preferences} attractions in {destination}"
    else:
        query = f"best attractions in {destination}"

    results = serpapi.search({
        "engine": "google_local",
        "q": query,
        "api_key": SERPAPI_KEY,
    })

    return results

def search_restaurants(destination, dietary_preferences=None):
    if dietary_preferences:
        preferences = ", ".join(dietary_preferences)
        query = f"best {preferences} restaurants in {destination}"
    else:
        query = f"best restaurants in {destination}"

    results = serpapi.search({
        "engine": "google_local",
        "q": query,
        "api_key": SERPAPI_KEY,
    })

    return results