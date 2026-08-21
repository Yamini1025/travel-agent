import { useState } from 'react'
import './App.css'

const initialTrips = [
  { id: 'tokyo', title: 'Tokyo in 5 Days', dates: 'Oct 14 - Oct 19, 2024', tags: ['Urban', 'Foodie', 'AI Planned'], status: 'Upcoming in 12 days', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=85' },
  { id: 'paris', title: 'Paris Highlights', dates: 'Dec 10 - Dec 15, 2024', tags: ['Romantic', 'Museums'], status: 'Drafting', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85' },
  { id: 'alps', title: 'Alpine Adventure', dates: 'Aug 02 - Aug 12, 2023', tags: ['Nature', 'Hiking'], status: 'Completed', image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=85' },
]

const blankTrip = { destination: '', startDate: '', endDate: '', travelers: '2 Travelers', ages: '', budget: 'Mid-range', interests: '', preferences: '' }

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span> }

function TripCard({ trip }) {
  return <article className={`trip-card ${trip.status === 'Upcoming in 12 days' ? 'featured' : ''}`}>
    <div className="trip-image" style={{ backgroundImage: `url(${trip.image})` }}><span className="status-pill"><span className="status-dot" />{trip.status}</span></div>
    <div className="trip-content"><div className="trip-heading"><div><h2>{trip.title}</h2><p className="trip-date"><Icon>□</Icon>{trip.dates}</p></div><button className="more-button" aria-label={`More options for ${trip.title}`}>⋮</button></div>
      <div className="tag-row">{trip.tags.map((tag) => <span className={tag === 'AI Planned' ? 'tag accent-tag' : 'tag'} key={tag}>{tag}</span>)}</div>
      <div className="trip-footer">{trip.status === 'Completed' ? <span className="rating">★ 5.0 Rating</span> : <span className="progress">{trip.status === 'Drafting' ? '65% Complete' : 'Ready to explore'}</span>}<button className={trip.status === 'Completed' ? 'text-button' : 'card-button'}>{trip.status === 'Completed' ? 'View Memories' : trip.status === 'Drafting' ? 'Continue  →' : 'View Itinerary  →'}</button></div>
    </div>
  </article>
}

function App() {
  const [trips, setTrips] = useState(initialTrips)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [form, setForm] = useState(blankTrip)
  const updateForm = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submitTrip = (event) => {
    event.preventDefault()
    if (!form.destination.trim() || !form.startDate || !form.endDate) return
    const destination = form.destination.trim()
    const start = new Date(`${form.startDate}T00:00:00`)
    const end = new Date(`${form.endDate}T00:00:00`)
    const dates = `${start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}, ${end.getFullYear()}`
    setTrips([{ ...initialTrips[0], ...form, id: `${destination}-${Date.now()}`, title: `${destination} escape`, dates, status: 'AI Planned', tags: [form.budget, form.interests || 'New adventure'] }, ...trips])
    setForm(blankTrip); setIsFormOpen(false)
  }

  return (
    <main className="app-shell"><section className="workspace">
      <div className="page-heading"><div><p className="eyebrow">YOUR TRAVEL COLLECTION</p><h1>My <span>Itineraries</span></h1><p className="subtitle">Manage your upcoming journeys, relive past adventures, and tweak AI-generated travel plans.</p></div><button className="primary-button heading-action" onClick={() => setIsFormOpen(true)}><span>✦</span> Plan Your Next Journey</button></div>
      <div className="toolbar"><label className="search-field"><Icon>⌕</Icon><input placeholder="Find a trip by destination or name..." /></label><div className="filters"><button className="filter active">All Trips</button><button className="filter">Upcoming</button><button className="filter">Past</button><button className="filter">☷ Filters</button></div></div>
      <div className="trip-grid">{trips.map((trip) => <TripCard trip={trip} key={trip.id} />)}<button className="new-journey" onClick={() => setIsFormOpen(true)}><span className="plus">+</span><strong>Plan a New Journey</strong><span>Let our AI craft the perfect itinerary for your next dream destination.</span><b>✦ Generate Trip</b></button></div>
    </section>{isFormOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setIsFormOpen(false)}><form className="trip-form" onSubmit={submitTrip}>
      <div className="form-heading"><div><p className="eyebrow">BUILD SOMETHING MEMORABLE</p><h2>Plan Your Next Adventure</h2></div><button type="button" className="close-button" onClick={() => setIsFormOpen(false)} aria-label="Close form">×</button></div>
      <div className="form-grid"><label>Destination<input name="destination" value={form.destination} onChange={updateForm} placeholder="Where to?" required /></label><label>Start Date<input name="startDate" type="date" value={form.startDate} onChange={updateForm} required /></label><label>End Date<input name="endDate" type="date" value={form.endDate} onChange={updateForm} required /></label><label>Travelers<select name="travelers" value={form.travelers} onChange={updateForm}><option>1 Traveler</option><option>2 Travelers</option><option>3 Travelers</option><option>4+ Travelers</option></select></label><label>Ages<input name="ages" value={form.ages} onChange={updateForm} placeholder="e.g. 2 Adults, 1 Child" /></label><label>Budget<select name="budget" value={form.budget} onChange={updateForm}><option>Budget-friendly</option><option>Mid-range</option><option>Luxury</option></select></label><label>Interests<input name="interests" value={form.interests} onChange={updateForm} placeholder="Food, culture, beaches..." /></label><label className="wide-field">Preferences & constraints<textarea name="preferences" value={form.preferences} onChange={updateForm} placeholder="Anything we should keep in mind?" /></label></div>
      <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setIsFormOpen(false)}>Cancel</button><button className="primary-button" type="submit">✦ Magic Plan</button></div>
    </form></div>}</main>
  )
}

export default App
