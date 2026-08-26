import { useState } from "react";
import './TripCard.css';
import TripItinerary from './TripItinerary';

function TripCard({ trip, setShowItinerary, setSelectedTrip, onDelete }) {
  function handleClick() {
    setShowItinerary(true);
    setSelectedTrip(trip);
  }

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
            <button className="card-button" onClick={handleClick}>
              View Itinerary
            </button>
            <button className="delete-button" onClick={() => onDelete(trip.id)}>
              Delete
            </button>
          </div>
        </div>
      </article>
    </>
  );
}

export default TripCard;