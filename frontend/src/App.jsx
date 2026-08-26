import { useState, useEffect } from 'react'
import './App.css'
import TripCard from './components/TripCard';
import TripForm from './components/TripForm';
import TripItinerary from './components/TripItinerary';

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
  const [showItinerary, setShowItinerary] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    localStorage.setItem('trips', JSON.stringify(trips))
  }, [trips]);

  const parsePreferences = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const addTrip = async (form) => {
    setIsFormOpen(false);
    setSelectedTrip(null);
    setShowItinerary(true);

    try {
      const response = await fetch('http://localhost:8000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: form.destination,
          start_date: form.startDate,
          end_date: form.endDate,
          adults: Number(form.adults),
          children: Number(form.children),
          budget: form.budget,
          dietary_preferences: parsePreferences(form.dietaryPreferences),
          attraction_preferences: parsePreferences(form.attractionPreferences),
          preferences: form.preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create trip');
      }

      const data = await response.json();

      console.log('Backend response:', data);
      console.log('Itinerary:', data.itinerary);
      
      let itinerary = data.itinerary;

      if (typeof itinerary === 'string') {
        itinerary = itinerary
          .replace(/^```json\s*/, '')
          .replace(/\s*```$/, '');

        itinerary = JSON.parse(itinerary);
      }

      const destination = form.destination.trim();
      const dates = formatTripDates(form.startDate, form.endDate);

      const newTrip = {
          ...form,
          id: `${destination}-${Date.now()}`,
          title: destination,
          dates,
          itinerary: itinerary,
        };
      
      setSelectedTrip(newTrip);

      setTrips((currentTrips) => [
        newTrip,
        ...currentTrips,
      ]);

    } catch (error) {
      console.error('Error creating trip:', error);
    }
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
            <TripCard trip={trip} key={trip.id} setShowItinerary={setShowItinerary} setSelectedTrip={setSelectedTrip} onDelete={handleDelete}/>
          ))}
        </div>
      </section>
      {isFormOpen && (
        <TripForm
          onSubmit={addTrip}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      {showItinerary && (
        <TripItinerary
          trip={selectedTrip}
          onClose={() => setShowItinerary(false)}
        />
      )}
    </main>
  )
}

export default App