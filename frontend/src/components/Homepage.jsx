import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../App.css'
import TripCard from './TripCard';
import TripForm from './TripForm';
import SearchPopup from './SearchPopup';

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

function Homepage({ trips, setTrips }) {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('')

  const parsePreferences = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const filteredTrips = trips.filter((trip) => 
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.title.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const addTrip = async (form) => {
    setIsFormOpen(false);
    setSelectedTrip(null);
    setShowSearchPopup(true);

    try {
      const response = await fetch('http://localhost:8000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start_point: form.startPoint,
          destination: form.destination,
          start_date: form.startDate,
          end_date: form.endDate,
          trip_type: form.tripType,
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

      const destination = form.destination.trim();
      const dates = formatTripDates(form.startDate, form.endDate);

      const newTrip = {
          ...form,
          id: `${destination}-${Date.now()}`,
          title: destination,
          dates,
          flights: data.flights,
          hotels: data.hotels,
          attractions: data.attractions,
          restaurants: data.restaurants,
        };
      
      setSelectedTrip(newTrip);

      setTrips((currentTrips) => [
        newTrip,
        ...currentTrips,
      ]);

      setShowSearchPopup(false);
      navigate(`/selection/${newTrip.id}`, {
        state: {
          trip: newTrip,
          flights: data.flights,
          hotels: data.hotels,
          attractions: data.attractions,
          restaurants: data.restaurants,
        },
      });

    } catch (error) {
      console.error('Error creating trip:', error);
      setShowSearchPopup(false);
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
            <input 
              placeholder="Find a trip by destination or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          {filteredTrips.map((trip) => (
            <TripCard 
              trip={trip} 
              key={trip.id} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>
      {isFormOpen && (
        <TripForm
          onSubmit={addTrip}
          onClose={() => setIsFormOpen(false)}
        />
      )}
      {showSearchPopup && (
        <SearchPopup />
      )}
    </main>
  )
}

export default Homepage;