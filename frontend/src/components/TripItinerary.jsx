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
              <h3>Day 1 — Arrival</h3>
              <ul>
                <li>Arrive at destination</li>
                <li>Check into hotel</li>
                <li>Explore the local area</li>
                <li>Dinner at a local restaurant</li>
              </ul>
            </div>

            <div className="itinerary-day">
              <h3>Day 2 — Explore</h3>
              <ul>
                <li>Breakfast at the hotel</li>
                <li>Visit the main attractions</li>
              </ul>
            </div>

            <div className="itinerary-day">
              <h3>Day 3 — Departure</h3>
              <ul>
                <li>Check out from hotel</li>
                <li>Departure from destination</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripItinerary;