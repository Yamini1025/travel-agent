import { useState, useEffect } from 'react'
import './App.css'
import TripCard from './TripCard'
import TripForm from './TripForm'

function formatTripDates(startDate, endDate) {
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)

  const options = {
    month: 'short',
    day: '2-digit',
  }

  const startFormatted = start.toLocaleDateString('en-US', options)
  const endFormatted = end.toLocaleDateString('en-US', options)

  return `${startFormatted} - ${endFormatted}, ${end.getFullYear()}`
}

function App() {
  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem('trips');
    return savedTrips ? JSON.parse(savedTrips) : [];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips))
  }, [trips]);

  const addTrip = (form) => {
    const destination = form.destination.trim();
    const dates = formatTripDates(form.startDate, form.endDate);

    setTrips([
      {
        ...form,
        id: `${destination}-${Date.now()}`,
        title: destination,
        dates,
      },
      ...trips,
    ]);

    setIsFormOpen(false);
  }

  const handleDelete = (tripId) => {
    setTrips((currentTrips) =>
      currentTrips.filter((trip) => trip.id !== tripId)
    )
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR TRAVEL COLLECTION</p>
            <h1>
              My <span>Itineraries</span>
            </h1>
            <p className="subtitle">
              Manage your upcoming journeys!
            </p>
          </div>
        </div>
        <div className="toolbar">
          <label className="search-field">
            <input placeholder="Find a trip by destination or name..." />
          </label>
        </div>
        <div className="trip-grid">
          <button
            className="new-journey"
            onClick={() => setIsFormOpen(true)}
          >
            <span className="plus">+</span>
            <strong>Plan Your Next Adventure</strong>
          </button>
          {trips.map((trip) => (
            <TripCard trip={trip} key={trip.id} onDelete={handleDelete}/>
          ))}
        </div>
      </section>
      {isFormOpen && (
        <TripForm
          onSubmit={addTrip}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </main>
  )
}

export default App