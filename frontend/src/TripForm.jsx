import { useState } from "react";

const initialForm = {
  destination: '',
  startDate: '',
  endDate: '',
  adults: '',
  children: '',
  budget: '',
  interests: '',
  preferences: '',
}

function TripForm({ onSubmit, onClose }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
    setForm(initialForm);
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <form className="trip-form" onSubmit={handleSubmit}>
        <div className="form-heading">
          <div>
            <p className="eyebrow">BUILD SOMETHING MEMORABLE</p>
            <h2>Plan Your Next Adventure</h2>
          </div>
          <button
            type="button"
            className="close-button"
            onClick={onClose}
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
              onChange={handleChange}
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
              onChange={handleChange}
              required
            />
          </label>
          <label>
            End Date
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Adults
            <input
              name="adults"
              type="number"
              min="0"
              value={form.adults}
              onChange={handleChange}
              placeholder="Number of adults"
              required
            />
          </label>

          <label>
            Children
            <input
              name="children"
              type="number"
              min="0"
              value={form.children}
              onChange={handleChange}
              placeholder="Number of children"
              required
            />
          </label>
          <label>
            Budget
            <select name="budget" value={form.budget} onChange={handleChange} required>
              <option value="" disabled>Select budget</option>
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
              onChange={handleChange}
              placeholder="Food, culture, beaches..."
            />
          </label>
          <label className="wide-field">
            Preferences
            <textarea
              name="preferences"
              value={form.preferences}
              onChange={handleChange}
              placeholder="Anything we should keep in mind?"
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" type="submit">
            ✦ Enter
          </button>
        </div>
      </form>
    </div>
  )
}

export default TripForm;