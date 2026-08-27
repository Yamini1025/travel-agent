import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3.5-flash")


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
    - If the user has mentioned dietary preferences, attraction preferences, or just general preferences, incorporate them into the itinerary.
    - Use the provided flight, hotel, attraction, and restaurant information when appropriate.
    - Only recommend specific flights, hotels, attractions, and restaurants when they are in the provided travel research. Do not invent specific 
      businesses, prices, ratings, flight details, or hotel details.
    - Organize the itinerary by day, for example : Day 1 itinerary, then Day 2 itinerary, then Day 3 itinerary.
    - Include morning, afternoon, and evening activities. Do not force activities into every time period if they would make the itinerary unrealistic. Include the time for each activity instead of labeling them as morning, afternoon, or evening.
    - Include restaurant suggestions for meals when appropriate.
    - Make the itinerary realistic and avoid overloading each day with too many activities. 
    - Keep activities geographically sensible when possible so the traveler does not unnecessarily travel back and forth across the destination.
    - Prioritize POPULAR tourist attractions and restaurants when possible.

    - Write all titles, descriptions, locations, and other text values in natural, polished, grammatically correct English. 
    - Use clear, conversational language that sounds like a helpful human travel planner. 
    - Avoid awkward, robotic, repetitive, or machine-translated phrasing. 
    - Do not include unnecessary filler or generic statements. 
    - Do not make unsupported claims about businesses, attractions, prices, ratings, availability, or opening dates.

    - Return ONLY valid JSON. 
    - Do NOT wrap the JSON in Markdown code fences such as ```json. 
    - Do NOT include any text before or after the JSON. 
    - The JSON must follow exactly this structure:

    {{
        "days": [
            {{
                "day": 1,
                "date": "...",
                "title": "...",
                "activities": [
                    {{
                    "time": "...",
                    "type": "activity | attraction | restaurant",
                    "title": "...",
                    "description": "...",
                    "location": "..."
                    }}
                ]
            }}
        ]
    }}
    """

    response = model.generate_content(prompt)

    return response.text
