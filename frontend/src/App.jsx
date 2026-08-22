import { useState } from 'react'
import './App.css'
import TripCard from './TripCard'

const initialTrips = [
  {
    id: 'tokyo',
    title: 'Tokyo',
    dates: 'Oct 14 - Oct 19, 2024',
  },
  {
    id: 'paris',
    title: 'Paris',
    dates: 'Dec 10 - Dec 15, 2024',
  },
  {
    id: 'alps',
    title: 'Alpine',
    dates: 'Aug 02 - Aug 12, 2023',
  },
]

const blankTrip = {
  destination: '',
  startDate: '',
  endDate: '',
  travelers: '2 Travelers',
  ages: '',
  budget: 'Mid-range',
  interests: '',
  preferences: '',
}

function App() {
  const [trips, setTrips] = useState(initialTrips)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState(blankTrip)
  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const submitTrip = (event) => {
    event.preventDefault()
    if (!form.destination.trim() || !form.startDate || !form.endDate) return
    const destination = form.destination.trim()
    const start = new Date(`${form.startDate}T00:00:00`)
    const end = new Date(`${form.endDate}T00:00:00`)
    const dates = `${start.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
    })} - ${end.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
    })}, ${end.getFullYear()}`

    setTrips([
      {
        ...initialTrips[0],
        ...form,
        id: `${destination}-${Date.now()}`,
        title: `${destination} escape`,
        dates,
        status: 'AI Planned',
        tags: [form.budget, form.interests || 'New adventure'],
      },
      ...trips,
    ])
    setForm(blankTrip)
    setIsFormOpen(false)
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
              Manage your upcoming journeys, relive past adventures, and tweak
              AI-generated travel plans.
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
            <strong>Plan a New Journey</strong>
          </button>
          {trips.map((trip) => (
            <TripCard trip={trip} key={trip.id} />
          ))}
        </div>
      </section>

      {isFormOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setIsFormOpen(false)
          }
        >
          <form className="trip-form" onSubmit={submitTrip}>
            <div className="form-heading">
              <div>
                <p className="eyebrow">BUILD SOMETHING MEMORABLE</p>
                <h2>Plan Your Next Adventure</h2>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <div className="form-grid">
              <label>
                Destination
                <input
                  name="destination"
                  value={form.destination}
                  onChange={updateForm}
                  placeholder="Where to?"
                  required
                />
              </label>
              <label>
                Start Date
                <input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={updateForm}
                  required
                />
              </label>
              <label>
                End Date
                <input
                  name="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={updateForm}
                  required
                />
              </label>
              <label>
                Travelers
                <select
                  name="travelers"
                  value={form.travelers}
                  onChange={updateForm}
                >
                  <option>1 Traveler</option>
                  <option>2 Travelers</option>
                  <option>3 Travelers</option>
                  <option>4+ Travelers</option>
                </select>
              </label>
              <label>
                Ages
                <input
                  name="ages"
                  value={form.ages}
                  onChange={updateForm}
                  placeholder="e.g. 2 Adults, 1 Child"
                />
              </label>
              <label>
                Budget
                <select name="budget" value={form.budget} onChange={updateForm}>
                  <option>Budget-friendly</option>
                  <option>Mid-range</option>
                  <option>Luxury</option>
                </select>
              </label>
              <label>
                Interests
                <input
                  name="interests"
                  value={form.interests}
                  onChange={updateForm}
                  placeholder="Food, culture, beaches..."
                />
              </label>
              <label className="wide-field">
                Preferences & constraints
                <textarea
                  name="preferences"
                  value={form.preferences}
                  onChange={updateForm}
                  placeholder="Anything we should keep in mind?"
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </button>
              <button className="primary-button" type="submit">
                ✦ Enter
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  )
}

export default App
