import os
from dotenv import load_dotenv
import serpapi

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")

def get_airport_id(destination):
    results = serpapi.search({
        "engine": "google_flights_autocomplete",
        "q": destination,
        "gl": "us",
        "hl": "en",
        "api_key": SERPAPI_KEY,
    })

    suggestions = results.get("suggestions", [])

    for suggestion in suggestions:
        if suggestion.get("type") == "city":
            airports = suggestion.get("airports", [])

            if airports:
                return airports[0].get("id")

    if "," in destination:
        broader_location = destination.split(",")[0].strip()

        results = serpapi.search({
            "engine": "google_flights_autocomplete",
            "q": broader_location,
            "gl": "us",
            "hl": "en",
            "api_key": SERPAPI_KEY,
        })

        suggestions = results.get("suggestions", [])

        for suggestion in suggestions:
            if suggestion.get("type") == "city":
                airports = suggestion.get("airports", [])

                if airports:
                    return airports[0].get("id")

    return None

def search_flights(destination, start_date, end_date):
    try :
        arrival_id = get_airport_id(destination)
        if not arrival_id:
            print(f"Could not find airport ID for destination: {destination}")
            return []
        
        results = serpapi.search({
            "engine": "google_flights",
            "departure_id": "SFO",
            "arrival_id": arrival_id,
            "type" : "1",
            "outbound_date": start_date,
            "return_date": end_date,
            "api_key": SERPAPI_KEY,
        })

        print("FLIGHT ARRIVAL ID:", arrival_id)
        print("FLIGHT RESULT KEYS:", results.keys())
        print("========== FLIGHT DEBUG ==========")
        print(results.get("best_flights", [])[0])
        print("==================================")

        print("ABOUT TO DEFINE FLIGHTS")
        flights = results.get("best_flights", [])
        print("FLIGHTS DEFINED:", len(flights))

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
                    .get("arrival_airport", {}).get("id"),
                "departure_token": flight.get("departure_token")
            }
            for flight in flights
        ]
    except Exception as e:
        print(f"Flight search error: {e}")
        return []
    
def get_return_flight(destination, end_date, airline):
    try:
        departure_id = get_airport_id(destination)

        if not departure_id:
            print(f"Could not find airport ID for destination: {destination}")
            return None

        results = serpapi.search({
            "engine": "google_flights",
            "departure_id": departure_id,
            "arrival_id": "SFO",
            "type": "2",
            "outbound_date": end_date,
            "api_key": SERPAPI_KEY,
        })

        flights = results.get("best_flights", [])

        # Find a return flight from the same airline
        matching_flights = [
            flight
            for flight in flights
            if flight.get("flights", [{}])[0].get("airline") == airline
        ]

        if not matching_flights:
            print(f"No return flight found for airline: {airline}")
            return None

        flight = matching_flights[0]
        segments = flight.get("flights", [])

        if not segments:
            return None

        return {
            "price": flight.get("price"),
            "airline": segments[0].get("airline"),
            "total_duration_minutes": flight.get("total_duration"),
            "stops": len(flight.get("layovers", [])),
            "departure": segments[0]
                .get("departure_airport", {}).get("time"),
            "arrival": segments[-1]
                .get("arrival_airport", {}).get("time"),
            "departure_airport": segments[0]
                .get("departure_airport", {}).get("id"),
            "arrival_airport": segments[-1]
                .get("arrival_airport", {}).get("id")
        }

    except Exception as e:
        print(f"Return flight search error: {e}")
        return None

    except Exception as e:
        print(f"Return flight search error: {e}")
        return None

def search_hotels(destination, start_date, end_date):
    try:
        results = serpapi.search({
            "engine": "google_hotels",
        "q": destination,
        "check_in_date": start_date,
        "check_out_date": end_date,
        "api_key": SERPAPI_KEY,
        })

        print("HOTEL RESULT KEYS:", results.keys())
        hotels = results.get("properties", [])
        print("NUMBER OF HOTELS:", len(hotels))

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
                "latitude": hotel.get("gps_coordinates", {}).get("latitude"),
                "longitude": hotel.get("gps_coordinates", {}).get("longitude"),
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

    try:
        results = serpapi.search({
            "engine": "google_local",
            "q": query,
            "api_key": SERPAPI_KEY,
        })

        attractions = results.get("local_results", [])
        formatted_attractions = []

        if not attractions:
            return []

        for attraction in attractions:
            formatted_attraction = {
                "name": attraction.get("title"),
                "description": attraction.get("description"),
                "address": attraction.get("address"),
                "hours": attraction.get("hours"),
                "website": attraction.get("links", {}).get("website"),
                "directions": attraction.get("links", {}).get("directions"),
                "latitude": attraction.get("gps_coordinates", {}).get("latitude"),
                "longitude": attraction.get("gps_coordinates", {}).get("longitude")
            }

            formatted_attractions.append(formatted_attraction)

        return formatted_attractions
    except Exception as e:
        print(f"Attraction search error: {e}")
        return []

def search_restaurants(destination, dietary_preferences=None):
    if dietary_preferences:
        preferences = ", ".join(dietary_preferences)
        query = f"best {preferences} restaurants in {destination}"
    else:
        query = f"best restaurants in {destination}"

    try:
        results = serpapi.search({
            "engine": "google_local",
            "q": query,
            "api_key": SERPAPI_KEY,
        })

        restaurants = results.get("local_results", [])
        formatted_restaurants = []

        if not restaurants:
            return []

        for restaurant in restaurants:
            formatted_restaurant = {
                "name": restaurant.get("title"),
                "description": restaurant.get("description"),
                "review_count": restaurant.get("reviews"),
                "rating": restaurant.get("rating"),
                "cuisine": restaurant.get("type"),
                "address": restaurant.get("address"),
                "hours": restaurant.get("hours"),
                "latitude": restaurant.get("gps_coordinates", {}).get("latitude"),
                "longitude": restaurant.get("gps_coordinates", {}).get("longitude")
            }

            formatted_restaurants.append(formatted_restaurant)

        return formatted_restaurants
    except Exception as e:
        print(f"Restaurant search error: {e}")
        return []



        