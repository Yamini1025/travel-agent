import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def generate_itinerary(trip, search_results):
    prompt = f"""
    You are an AI travel planner.

    Create a realistic day-by-day travel itinerary using the user's
    trip information and the travel research provided.

    USER TRIP:
    {trip}

    TRAVEL RESEARCH:
    {search_results}

    Requirements:
    - The itinerary should follow the user's trip, like destination and dates.
    - Take the number of adults and children into consideration.
    - Stay within the user's budget.
    - If the user has mentioned dietary preferences and attraction preferences, incorporate them into the itinerary.
    - Use the provided flight, hotel, attraction, and restaurant information when appropriate.
    - Only recommend specific flights, hotels, attractions, and restaurants when they are in the provided travel research. Do not invent specific 
      businesses, prices, ratings, flight details, or hotel details.
    - Organize the itinerary by day, for example : Day 1 itinerary, then Day 2 itinerary, then Day 3 itinerary.
    - Include morning, afternoon, and evening activities.
    - Include restaurant suggestions for meals when appropriate.

    Return a clear, structured itinerary.
    """

    response = model.generate_content(prompt)

    return response.text
