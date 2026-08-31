function HotelSelection({ hotels, selectedHotel, setSelectedHotel }) {
    return (
        <section className="selection-section">
        <h2>Hotels</h2>
        <div className="hotels">
          {hotels?.length > 0 ? (
            hotels.map((hotel, index) => (
              <label
                key={index}
                className={`selection-card ${
                  selectedHotel === hotel ? 'selected' : ''
                }`}
              >
                <div className="hotel-info">
                  <div className="card-title-row">
                    <input
                      type="radio"
                      name="hotel"
                      checked={selectedHotel === hotel}
                      onChange={() => setSelectedHotel(hotel)}
                    />
                    <div className="radio-circle"></div>
                    <h3>{hotel.name}</h3>
                  </div>

                  <p>{hotel.description}</p>

                  <span>
                    {hotel.rating
                      ? `⭐ ${hotel.rating}`
                      : 'No rating available'}
                  </span>
                </div>

                <strong>
                  ${hotel.price_per_night ?? 'N/A'} / night
                </strong>
              </label>
            ))
          ) : (
            <p>No hotels found.</p>
          )}
        </div>
      </section>
    );
}

export default HotelSelection;