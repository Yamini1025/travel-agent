import os
from dotenv import load_dotenv
import serpapi

load_dotenv()

SERPAPI_KEY = os.getenv("SERPAPI_KEY")


def search_google(query):
    if not SERPAPI_KEY:
        raise ValueError("SERPAPI_KEY is not set")

    results = serpapi.search({
        "engine": "google",
        "q": query,
        "api_key": SERPAPI_KEY,
    })

    return results