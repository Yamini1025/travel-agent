import { useState, useEffect } from 'react';
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
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    return () => {
      if (!completed && trip) {
        setTrips((currentTrips) =>
          currentTrips.filter((savedTrip) => savedTrip.id !== trip.id)
        );
      }
    };
  }, [completed, trip, setTrips]);

  if (!trip) {
    return <p>No trip information found.</p>;
  }

  async function handleContinue() {
    if (!selectedFlight || !selectedHotel) {
      return;
    }
    setIsGenerating(true);

    try {
      const response = await fetch(
        'http://localhost:8000/api/generate-itinerary',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trip,
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

      setCompleted(true);

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