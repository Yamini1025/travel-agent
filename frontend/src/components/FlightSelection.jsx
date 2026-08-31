function FlightSelection({ flights, selectedFlight, setSelectedFlight }) {
    return (
        <section className="selection-section">
        <h2>Flights</h2>
        <div className="flights">
          {flights?.length > 0 ? (
            flights.map((flight, index) => (
              <label
                key={index}
                className={`selection-card ${
                  selectedFlight === flight ? 'selected' : ''
                }`}
              >
                <div className="flight-info">
                  <div className="card-title-row">
                    <input
                      type="radio"
                      name="flight"
                      checked={selectedFlight === flight}
                      onChange={() => setSelectedFlight(flight)}
                    />
                    <div className="radio-circle"></div>
                    <h3>{flight.airline}</h3>
                  </div>
                  <p>
                    {flight.departure} → {flight.arrival}
                  </p>
                  <span>
                    {flight.stops === 0
                      ? 'Nonstop'
                      : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                  </span>
                </div>
                <strong>${flight.price}</strong>
              </label>
            ))
            ) : (
                <p>No flights found.</p>
            )}
            </div>
      </section>
    );
}

export default FlightSelection;