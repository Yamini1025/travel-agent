import { useState } from "react";
import './TripCard.css';
import TripItinerary from './TripItinerary';

function TripCard({ trip, onDelete }) {
  const [showItinerary, setShowItinerary] = useState(false);
  

  const handleViewItinerary = () => {
    setShowItinerary(true);
  };

  return (
    <>
      <article className="trip-card">
        <div className="trip-content">
          <div className="trip-heading">
            <div>
              <h2>{trip.title}</h2>
              <p className="trip-date">{trip.dates}</p>
            </div>
          </div>
          <div className="trip-footer">
            <button className="card-button" onClick={handleViewItinerary}>
              View Itinerary
            </button>

            <button className="delete-button" onClick={() => onDelete(trip.id)}>
              Delete
            </button>
          </div>
        </div>
      </article>

      {showItinerary && (
        <TripItinerary
          trip={trip}
          onClose={() => setShowItinerary(false)}
        />
      )}
    </>
  );
}

export default TripCard;