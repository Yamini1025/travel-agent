import os
from dotenv import load_dotenv
import google.generativeai as genai
import json

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-3.5-flash")

def validate_preferences(dietary_preferences, attraction_preferences, preferences):
    prompt = f"""
    You are validating user input for a travel planning application.

    Determine whether each field contains meaningful, relevant travel preferences.

    DIETARY PREFERENCES:
    {dietary_preferences}

    ATTRACTION PREFERENCES:
    {attraction_preferences}

    GENERAL PREFERENCES:
    {preferences}

    Rules:
    - Empty fields are valid because they are optional.
    - Natural language is allowed.
    - Specific preferences are allowed.
    - Accept reasonable travel-related preferences.
    - Reject random, nonsensical, gibberish, or clearly unrelated input.
    - Do not reject a preference simply because it is unusual.
    - Dietary preferences can include food restrictions, allergies, vegetarian, vegan, gluten-free, foods the user avoids, etc.
    - Attraction preferences can include beaches, museums, hiking, shopping, nightlife, theme parks, historical sites, scenic views, etc.
    - General preferences can include birthdays, anniversaries, preferred pace, transportation preferences, scheduling preferences, accessibility needs, etc.

    Return ONLY valid JSON in exactly this format:

    {{
        "dietary_valid": true,
        "dietary_message": "",
        "attraction_valid": true,
        "attraction_message": "",
        "general_valid": false,
        "general_message": "Please enter a meaningful travel preference."
    }}

    If any field is invalid, set its corresponding value to false and provide
    a short helpful message explaining what needs to be changed.
    """

    response = model.generate_content(prompt)

    result = response.text.strip()
    result = result.replace("```json", "").replace("```", "").strip()

    return json.loads(result)


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
    - For every activity, include an estimated duration for how long the traveler will spend there.
    - For every activity after the first activity of the day, include an estimated travel time from the previous activity.
    - Travel time should be realistic and account for walking, driving, public transportation, parking, and normal transitions.
    - Use reasonable estimates based on the locations provided.
    - For the first activity of each day, set "travel_time" to "N/A" unless there is a meaningful travel time from the previous day's location that should be included.
    - Return duration and travel_time as simple strings such as "1 hour", "45 minutes", or "15 minutes".

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
                        "location": "...",
                        "duration": "...",
                        "travel_time": "..."
                    }}
                ]
            }}
        ]
    }}
    """

    response = model.generate_content(prompt)

    return response.text
