import './TripItinerary.css';

function TripItinerary({ trip, onClose }) {
  return (
    <div className="itinerary-popup">
      <div className="itinerary-content">
        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        {!trip ? (
          <div className="loading-state">
            <h2>Generating your itinerary...</h2>
            <p>Please wait a few minutes while we plan your trip.</p>
          </div>
        ) : (
          <div className="itinerary-details">
            <h2>{trip.title} Itinerary</h2>
            <p className="trip-date">{trip.dates}</p>

            <div className="itinerary-day">
              {trip.itinerary.days.map((day) => (
                <div key={day.day}>
                  <h3>Day {day.day}: {day.title}</h3>

                  {day.activities.map((activity, index) => (
                    <div key={index}>
                      <h4>{activity.time} — {activity.title}</h4>
                      <p>{activity.description}</p>
                      <small>{activity.location}</small>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripItinerary;