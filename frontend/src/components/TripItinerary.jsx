import { useState, useEffect } from 'react';
import './TripItinerary.css';

function TripItinerary({ trip, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="itinerary-popup">
      <div className="itinerary-content">
        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        {isLoading ? (
          <div className="loading-state">
            <h2>Generating your itinerary...</h2>
            <p>Please wait a few minutes while we plan your trip.</p>
          </div>
        ) : (
          <div className="itinerary-details">
            <h2>{trip.title} Itinerary</h2>
            <p className="trip-date">{trip.dates}</p>

            <div className="itinerary-day">
              {trip.itinerary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripItinerary;