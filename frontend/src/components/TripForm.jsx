import { useState } from "react";
import './TripForm.css';

const initialForm = {
  destination: '',
  startDate: '',
  endDate: '',
  tripType: [],
  budget: '',
  dietaryPreferences: '',
  attractionPreferences: '',
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

  function handleClear(e) {
    e.preventDefault();
    setForm(initialForm);
  }

  function handleTripTypeChange(value) {
    setForm((currentForm) => {
      const alreadySelected = currentForm.tripType.includes(value);
      return {
        ...currentForm,
        tripType: alreadySelected
          ? currentForm.tripType.filter((item) => item !== value)
          : [...currentForm.tripType, value],
      };
    });
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
              min={form.startDate}
              onChange={handleChange}
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
        </div>
        <div className="trip-type-field">
          <span className="trip-type-label">Trip Type</span>
          <div className="checkbox-group">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={form.tripType.includes('adult')}
                onChange={() => handleTripTypeChange('adult')}
              />
              Adult Activities
            </label>
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={form.tripType.includes('kid')}
                onChange={() => handleTripTypeChange('kid')}
              />
              Kid-Friendly Activities
            </label>
          </div>
        </div>
        <div className="preferences">
          <label className="wide-field">
            Dietary Preferences 
            <textarea
              name="dietaryPreferences"
              value={form.dietaryPreferences}
              onChange={handleChange}
              placeholder="e.g. vegetarian, non-vegetarian, vegan..."
            />
          </label>
          <label className="wide-field">
            Attraction Preferences
            <textarea
              name="attractionPreferences"
              value={form.attractionPreferences}
              onChange={handleChange}
              placeholder="e.g. family-friendly, thrill rides..."
            />
          </label>
          <label className="wide-field">
            Anything else we should keep in mind?
            <textarea
              name="preferences"
              value={form.preferences}
              onChange={handleChange}
              placeholder="e.g. celebrating birthday, anniversary, etc."
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={handleClear}>
            Clear Form
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