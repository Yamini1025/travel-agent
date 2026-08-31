import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TripSelection.css';
import GeneratePopup from './GeneratePopup';

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
      <h1>Choose Your Flight & Hotel</h1>

      <section className="selection-section">
        <h2>Flights</h2>

        <div className="selection-grid">
          {flights?.length > 0 ? (
            flights.map((flight, index) => (
              <label
                className={`selection-card ${
                  selectedFlight === flight ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="flight"
                  checked={selectedFlight === flight}
                  onChange={() => setSelectedFlight(flight)}
                />

                <div className="radio-circle"></div>

                <div className="flight-info">
                  <h3>{flight.airline}</h3>

                  <p>
                    {flight.departure} → {flight.arrival}
                  </p>

                  <span>
                    {flight.stops === 0
                      ? 'Nonstop'
                      : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </span>
                </div>

                <strong>${flight.price}</strong>
              </label>
            ))
          ) : (
            <p>No flights found.</p>
          )}
        </div>
      </section>

      <section className="selection-section">
        <h2>Hotels</h2>

        <div className="selection-grid">
          {hotels?.length > 0 ? (
            hotels.map((hotel, index) => (
              <label
                key={index}
                className={`selection-card ${
                  selectedHotel === hotel ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="hotel"
                  checked={selectedHotel === hotel}
                  onChange={() => setSelectedHotel(hotel)}
                />

                <div className="radio-circle"></div>

                <div className="hotel-info">
                  <h3>{hotel.name}</h3>

                  <p>{hotel.description}</p>

                  <span>
                    {hotel.rating
                      ? `⭐ ${hotel.rating}`
                      : 'No rating available'}
                  </span>
                </div>

                <strong>
                  ${hotel.price_per_night ?? 'N/A'} / night
                </strong>
              </label>
            ))
          ) : (
            <p>No hotels found.</p>
          )}
        </div>
      </section>

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