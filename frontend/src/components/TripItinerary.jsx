import { useParams } from 'react-router-dom';

function TripItinerary({ trips }) {
    const { tripId } = useParams(); // get trip id from url
    const trip = trips.find((trip) => trip.id === tripId); // find matching trip from the saved trips

    return (
        <div className="itinerary-details">
            <h2 className="trip-title">{trip.title} Itinerary</h2>
            <p className="trip-date">{trip.dates}</p>
            <div className="itinerary-day">
                {trip.itinerary.days.map((day) => (
                    <div key={day.day}>
                        <h2 className="trip-day-title">Day {day.day}: {day.title}</h2>
                        {day.activities.map((activity, index) => (
                            <div key={index}>
                                <h3 className="activity-timestamp">[{activity.time}] {activity.title}</h3>
                                <h4 className="activity-location">📍 {activity.location}</h4>
                                <p className="activity-description">{activity.description}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TripItinerary;