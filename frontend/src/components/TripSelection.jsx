import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TripSelection.css';
import GeneratePopup from './GeneratePopup';
import FlightSelection from './FlightSelection';
import HotelSelection from './HotelSelection';

function TripSelection({setTrips}) {
  const navigate = useNavigate();
  const location = useLocation();

  const { trip, flights, hotels, attractions, restaurants } = location.state || {};

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!trip) {
    return <p>No trip information found.</p>;
  }

  async function handleContinue() {
    if (!selectedFlight || !selectedHotel) {
      return;
    }
    setIsGenerating(true);

    try {
      const { flights, hotels, attractions: tripAttractions, restaurants: tripRestaurants, ...tripForPrompt } = trip;
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/generate-itinerary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trip: tripForPrompt,
            selected_flight: selectedFlight,
            selected_hotel: selectedHotel,
            attractions,
            restaurants,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();

      console.log('Generated itinerary:', data.itinerary);

      let itinerary = data.itinerary;

      if (typeof itinerary === 'string') {
        itinerary = itinerary
          .replace(/^```json\s*/, '')
          .replace(/\s*```$/, '');

        itinerary = JSON.parse(itinerary);
      }

      const updatedTrip = {
        ...trip,
        itinerary,
        selectedFlight,
        selectedHotel,
      };

      setTrips((currentTrips) =>
        currentTrips.map((savedTrip) =>
          savedTrip.id === trip.id ? updatedTrip : savedTrip
        )
      );

      navigate(`/itinerary/${trip.id}`, {
        state: {
          trip,
          selectedFlight,
          selectedHotel,
          attractions,
          restaurants,
          itinerary,
        },
      });

    } catch (error) {
      console.error('Error generating itinerary:', error);
      setIsGenerating(false);
    }
  }

  return (
    <main className="selection-page">
      <p className='selection-page-title'>Choose Your Flight & Hotel</p>
      {(!flights?.length || !hotels?.length) && (
        <p className="search-error-message">
          Sorry, we couldn't retrieve flight or hotel information right now. Please try again later.
        </p>
      )}
      <div className='selection-grid'>
        <FlightSelection 
          flights={flights}
          selectedFlight={selectedFlight}
          setSelectedFlight={setSelectedFlight}
        />
        <HotelSelection 
          hotels={hotels}
          selectedHotel={selectedHotel}
          setSelectedHotel={setSelectedHotel}
        />
      </div>
      <button
        className="continue-button"
        disabled={!selectedFlight || !selectedHotel}
        onClick={handleContinue}
      >
        Continue to Itinerary
      </button>
      {isGenerating && (
        <GeneratePopup
          trip={trip}
          onClose={() => {}}
        />
      )}
    </main>
  );

}

export default TripSelection;