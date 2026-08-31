import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './TripItinerary.css';

function TripItinerary({ trips }) {
    const navigate = useNavigate();
    const { tripId } = useParams();
    const location = useLocation();

    const routerTrip = location.state?.trip;
    const routerItinerary = location.state?.itinerary;

    const savedTrip = trips.find((trip) => trip.id === tripId);

    const trip = routerTrip || savedTrip;
    const itinerary = routerItinerary || savedTrip?.itinerary;

    console.log("TRIP ID FROM URL:", tripId);
    console.log("ALL SAVED TRIPS:", trips);
    console.log("FOUND SAVED TRIP:", savedTrip);
    console.log("SAVED ITINERARY:", savedTrip?.itinerary);

    const [selectedDay, setSelectedDay] = useState(1);

    if (!trip || !itinerary) {
        return (
            <div className="itinerary-details">
                <h2>Itinerary not found.</h2>
                <button className="home-btn" onClick={() => navigate('/')}>
                    Home
                </button>
            </div>
        );
    }

    const day = itinerary.days.find(
        (day) => day.day === selectedDay
    );

    return (
        <div className="itinerary-details">
            <h2 className="trip-title">{trip.title}</h2>
            <p className="trip-date">{trip.dates}</p>

            <div className="itinerary-layout">
                <div className="navigation-system">
                    <div className="day-navigation">
                        {itinerary.days.map((day) => (
                            <button
                                className="day-btn"
                                key={day.day}
                                onClick={() => setSelectedDay(day.day)}
                            >
                                Day {day.day}
                            </button>
                        ))}
                    </div>

                    <button
                        className="home-btn"
                        onClick={() => navigate('/')}
                    >
                        Home
                    </button>
                </div>

                <div className="day-agenda">
                    <h2 className="trip-day-title">
                        Day {day.day}: {day.title}
                    </h2>

                    <h3 className="trip-date">
                        {day.date}
                    </h3>

                    {day.activities.map((activity, index) => (
                        <div
                            key={index}
                            className="activity-view"
                        >
                            <h4 className="activity-timestamp">
                                [{activity.time}]
                            </h4>

                            <div className="activity-details">
                                <h4 className="activity-title">
                                    {activity.title}
                                </h4>

                                <p className="activity-location">
                                    📍 {activity.location}
                                </p>

                                <p className="activity-description">
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TripItinerary;