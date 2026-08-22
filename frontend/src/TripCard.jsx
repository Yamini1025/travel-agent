import {useState} from "react";

function TripCard({ trip, onDelete }) {
    const [showItinerary, setShowItinerary] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleViewItinerary = () => {
        setShowItinerary(true);
        setIsLoading(true);
        
        setTimeout(() => {
            setShowItinerary(true);
            setIsLoading(false);
        }, 1000);
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

                <button
                    className="delete-button"
                    onClick={() => onDelete(trip.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    </article>

    {showItinerary && (
        <div className="itinerary-popup">
            <div className="itinerary-content">
            <button
              className="popup-close"
              onClick={() => setShowItinerary(false)}
            >
              ×
            </button>

            {isLoading ? (
              <div className="loading-state">
                <h2>Generating your itinerary...</h2>
                <p>
                  Please wait a few minutes while we plan your trip.
                </p>
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
    )}
    </>
  );
}

export default TripCard;