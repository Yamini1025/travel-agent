import os
from dotenv import load_dotenv
import serpapi

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")


def search_flights(destination, start_date):
    results = serpapi.search({
        "engine": "google_flights",
        "departure_id": "SFO",
        "arrival_id": destination,
        "outbound_date": start_date,
        "api_key": SERPAPI_KEY,
    })

    return results

def search_hotels(destination, start_date, end_date):
    results = serpapi.search({
        "engine": "google_hotels",
        "q": destination,
        "check_in_date": start_date,
        "check_out_date": end_date,
        "api_key": SERPAPI_KEY,
    })

    return results

def search_attractions(destination, interests):
    if interests :
        query = f"best attractions in {destination} {interests}"
    else :
        query = f"best attractions in {destination}"

    results = serpapi.search({
        "engine": "google_local",
        "q": query,
        "api_key": SERPAPI_KEY,
    })

    return results

def search_restaurants(destination, interests):
    if interests :
        query = f"best restaurants in {destination} {interests}"
    else :
        query = f"best restaurants in {destination}"

    results = serpapi.search({
        "engine": "google_local",
        "q": query,
        "api_key": SERPAPI_KEY,
    })

    return results