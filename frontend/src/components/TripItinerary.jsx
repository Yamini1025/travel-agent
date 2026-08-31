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

    const selectedFlight = location.state?.selectedFlight || savedTrip?.selectedFlight;
const selectedHotel = location.state?.selectedHotel || savedTrip?.selectedHotel;

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
                <div className="trip-summary">
                    <h3 className="summary-title">Trip Details</h3>

                    <div className="summary-item">
                        <span className="summary-label">Destination</span>
                        <span className="summary-value">{trip.destination}</span>
                    </div>
                    {trip.tripType?.length > 0 && (
                        <div className="summary-item">
                            <span className="summary-label">Trip Type</span>
                            <span className="summary-value">
                                {trip.tripType
                                    .map((type) => (type === 'adult' ? 'Adult Activities' : 'Kid-Friendly Activities'))
                                    .join(' + ')}
                            </span>
                        </div>
                    )}
                    <div className="summary-item">
                        <span className="summary-label">Budget</span>
                        <span className="summary-value">{trip.budget}</span>
                    </div>

                    {trip.dietaryPreferences && (
                        <div className="summary-item">
                            <span className="summary-label">Dietary</span>
                            <span className="summary-value">{trip.dietaryPreferences}</span>
                        </div>
                    )}

                    {trip.attractionPreferences && (
                        <div className="summary-item">
                            <span className="summary-label">Attractions</span>
                            <span className="summary-value">{trip.attractionPreferences}</span>
                        </div>
                    )}

                    {trip.preferences && (
                        <div className="summary-item">
                            <span className="summary-label">Notes</span>
                            <span className="summary-value">{trip.preferences}</span>
                        </div>
                    )}

                    {selectedFlight && (
                        <div className="summary-item">
                            <span className="summary-label">Flight</span>
                            <span className="summary-value">
                                {selectedFlight.airline} · ${selectedFlight.price}
                            </span>
                        </div>
                    )}

                    {selectedHotel && (
                        <div className="summary-item">
                            <span className="summary-label">Hotel</span>
                            <span className="summary-value">{selectedHotel.name}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TripItinerary;