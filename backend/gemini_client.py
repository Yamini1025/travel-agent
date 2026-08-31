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
    - The itinerary should follow the user's trip, including destination, travel dates, and trip length.
    - Take the trip type (adult activities, kid-friendly activities, or both) into consideration when selecting activities, restaurants, and the overall pace of the itinerary. If both are selected, balance the itinerary so it includes activities suitable for the whole group.
    - Stay within the user's stated budget. Consider the cost of both activities and food, not just transportation or accommodation.
    - Adjust the itinerary based on the user's budget level:
      Budget-friendly: Prioritize free and low-cost attractions, walking routes, public transportation, affordable restaurants, and iconic experiences that provide strong value. Include paid attractions selectively when they are particularly popular or important to the destination.
      Mid-range: Include a balanced mix of free and paid attractions, moderately priced restaurants, and occasional higher-cost experiences.
      Luxury: Include more premium attractions, experiences, restaurants, and convenient transportation when appropriate.
    - If the user has mentioned dietary preferences, attraction preferences, or just general preferences, incorporate them throughout the itinerary.
    - For tourists, prioritize popular and iconic attractions that are strongly associated with the destination. Do not focus only on lesser-known or highly rated local recommendations when major tourist attractions would be more appropriate.
    - Balance iconic tourist attractions with local neighborhoods, scenic areas, cultural experiences, and other activities that fit the user's interests and budget.
    - Use the provided flight, hotel, attraction, and restaurant information when appropriate.
    - Only recommend specific flights, hotels, attractions, and restaurants when they are in the provided travel research. Do not invent specific 
      businesses, prices, ratings, flight details, or hotel details.
    - Organize the itinerary by day, for example : Day 1 itinerary, then Day 2 itinerary, then Day 3 itinerary.
    - Include morning, afternoon, and evening activities. Do not force activities into every time period if they would make the itinerary unrealistic. 
    - Include the time for each activity instead of labeling them as morning, afternoon, or evening. The time must be in 12-hour format with AM/PM.
    - Include realistic travel time between activities. Do not assume the traveler can instantly move from one location to another. Account for walking, driving, public transportation, parking, and typical transition time when appropriate.
    - Include restaurant suggestions for meals when appropriate.
    - Make the itinerary realistic and avoid overloading each day with too many activities. 
    - Keep activities geographically sensible when possible so the traveler does not unnecessarily travel back and forth across the destination.
    - Prioritize POPULAR tourist attractions and restaurants when possible.
    - When multiple attractions are available, prioritize options based on this order:
      1. Relevance to the user's preferences
      2. Popularity and importance to tourists
      3. Budget compatibility
      4. Geographic proximity to other activities
      5. Realistic timing and travel time

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
