function TripCard({ trip }) {
  return (
        <article className="trip-card">
        <div className="trip-content">
            <div className="trip-heading">
                <div>
                    <h2>{trip.title}</h2>
                    <p className="trip-date">{trip.dates}</p>
                </div>
            </div>
            <div className="trip-footer">
                <button className="card-button">View Itinerary</button>
            </div>
        </div>
    </article>
  ); 
}

export default TripCard;