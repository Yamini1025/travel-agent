import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './TripItinerary.css';

function TripItinerary({ trips }) {
    const { tripId } = useParams(); // get trip id from url
    const trip = trips.find((trip) => trip.id === tripId); // find matching trip from the saved trips

    const [selectedDay, setSelectedDay] = useState(1); // stores which day is currently selected

    const day = trip.itinerary.days.find((day) => day.day === selectedDay); // finds the selected day from the days

    return (
        <div className="itinerary-details">
            <h2 className="trip-title">{trip.title}</h2>
            <p className="trip-date">{trip.dates}</p>
            <div className="itinerary-layout">
                <div className="day-navigation">
                    {trip.itinerary.days.map((day) => (
                        <button
                            className="day-btn" 
                            key={day.day}
                            onClick={() => setSelectedDay(day.day)}
                        >
                            Day {day.day}
                        </button>
                    ))}
                </div>
                <div className="day-agenda">
                    <h2 className="trip-day-title">Day {day.day}: {day.title}</h2>
                    <h3 className="trip-date">{day.date}</h3>
                    {day.activities.map((activity, index) => (
                        <div key={index} className="activity-view">
                            <h4 className="activity-timestamp">[{activity.time}]</h4>
                            <div className="activity-details">
                                <h4 className="activity-title">{activity.title}</h4>
                                <p className="activity-location">📍 {activity.location}</p>
                                <p className="activity-description">{activity.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TripItinerary;