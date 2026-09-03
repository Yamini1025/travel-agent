import { useState } from "react";
import './TripForm.css';

const initialForm = {
  startPoint: '',
  destination: '',
  startDate: '',
  endDate: '',
  tripType: [],
  budget: '',
  dietaryPreferences: '',
  attractionPreferences: '',
  preferences: '',
}

const initialErrors = {
  startPoint: '',
  destination: '',
  startDate: '',
  endDate: '',
  budget: '',
  dietaryPreferences: '',
  attractionPreferences: '',
  preferences: '',
}

console.log("API URL:", import.meta.env.API_BASE_URL);

function TripForm({ onSubmit, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [isValidating, setIsValidating] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function checkPlaceIsValid(place) {
    const response = await fetch(`${import.meta.env.API_BASE_URL}/api/validate-destination`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination: place }),
    });

    const data = await response.json();
    return data.valid;
  }

    function parsePreferences(value) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  async function validatePreferences() {
    const response = await fetch(
      `${import.meta.env.API_BASE_URL}/api/validate-preferences`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietary_preferences: parsePreferences(form.dietaryPreferences),
          attraction_preferences: parsePreferences(form.attractionPreferences),
          preferences: form.preferences,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to validate preferences');
    }

    const data = await response.json();
    return data.validation;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = { ...initialErrors };

    if (!form.startPoint.trim()) {
      newErrors.startPoint = 'Please enter a starting point.';
    }
    
    if (!form.destination.trim()) {
      newErrors.destination = 'Please enter a destination.';
    }
    
    if (!form.startDate) {
      newErrors.startDate = 'Please select a start date.';
    } else if (form.startDate < formattedToday) {
      newErrors.startDate = 'Start date cannot be in the past.';
    }
    
    if (!form.endDate) {
      newErrors.endDate = 'Please select an end date.';
    } else if (form.startDate && form.endDate < form.startDate) {
      newErrors.endDate = 'End date must be after the start date.';
    }
    
    if (!form.budget) {
      newErrors.budget = 'Please select a budget.';
    }

    const hasBasicErrors = Object.values(newErrors).some(Boolean);

    if (hasBasicErrors) {
      setErrors(newErrors);
      return;
    }

    setIsValidating(true);

    try {
      const [startPointValid, destinationValid, preferenceValidation] =
        await Promise.all([
          checkPlaceIsValid(form.startPoint),
          checkPlaceIsValid(form.destination),
          validatePreferences(),
        ]);

      const placeErrors = { ...newErrors };

      if (!startPointValid) {
        placeErrors.startPoint = "We couldn't find that starting point. Try a city name.";
      }
      if (!destinationValid) {
        placeErrors.destination = "We couldn't find that destination. Try a city name.";
      }
      if (!preferenceValidation.dietary_valid) {
        placeErrors.dietaryPreferences = preferenceValidation.dietary_message;
      }

      if (!preferenceValidation.attraction_valid) {
        placeErrors.attractionPreferences = preferenceValidation.attraction_message;
      }

      if (!preferenceValidation.general_valid) {
        placeErrors.preferences = preferenceValidation.general_message;
      }

      if (
        !startPointValid ||
        !destinationValid ||
        !preferenceValidation.dietary_valid ||
        !preferenceValidation.attraction_valid ||
        !preferenceValidation.general_valid
      ) {
        setErrors(placeErrors);
        setIsValidating(false);
        return;
      }

      onSubmit(form);
      setErrors(initialErrors);
    } catch (error) {
      console.error('Destination validation error:', error);
      setErrors({
        ...newErrors,
        destination: 'Something went wrong checking that destination. Please try again.',
      });
    } finally {
      setIsValidating(false);
    }
  }

  function handleClear(e) {
    e.preventDefault();
    setForm(initialForm);
    setErrors(initialErrors);
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

  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <form className="trip-form" onSubmit={handleSubmit} noValidate>
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
            Starting Point
            <input
              name="startPoint"
              type="text"
              value={form.startPoint}
              onChange={handleChange}
              placeholder="Where from?"
            />
            {errors.startPoint && <span className="field-error">{errors.startPoint}</span>}
          </label>
          <label>
            Destination
            <input
              name="destination"
              value={form.destination}
              onChange={handleChange}
              placeholder="Where to?"
            />
            {errors.destination && <span className="field-error">{errors.destination}</span>}
          </label>
          <p className="location-note">
            Enter both locations as a city name or city name, state name.
            <br />
            Example: San Francisco or San Francisco, CA
          </p>
          <label>
            Start Date
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              min={formattedToday}
              onChange={handleChange}
            />
            {errors.startDate && <span className="field-error">{errors.startDate}</span>}
          </label>
          <label>
            End Date
            <input
              name="endDate"
              type="date"
              value={form.endDate}
              min={form.startDate}
              onChange={handleChange}
            />
            {errors.endDate && <span className="field-error">{errors.endDate}</span>}
          </label>
          <label>
            Budget
            <select name="budget" value={form.budget} onChange={handleChange}>
              <option value="" disabled>Select budget</option>
              <option>Budget-friendly</option>
              <option>Mid-range</option>
              <option>Luxury</option>
            </select>
            {errors.budget && <span className="field-error">{errors.budget}</span>}
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
            {errors.dietaryPreferences && (
              <span className="field-error">{errors.dietaryPreferences}</span>
            )}
          </label>
          <label className="wide-field">
            Attraction Preferences
            <textarea
              name="attractionPreferences"
              value={form.attractionPreferences}
              onChange={handleChange}
              placeholder="e.g. family-friendly, thrill rides..."
            />
            {errors.attractionPreferences && (
              <span className="field-error">{errors.attractionPreferences}</span>
            )}
          </label>
          <label className="wide-field">
            Anything else we should keep in mind?
            <textarea
              name="preferences"
              value={form.preferences}
              onChange={handleChange}
              placeholder="e.g. celebrating birthday, anniversary, etc."
            />
            {errors.preferences && (
              <span className="field-error">{errors.preferences}</span>
            )}
          </label>
        </div>
        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={handleClear}>
            Clear Form
          </button>
          <button className="primary-button" type="submit" disabled={isValidating}>
            {isValidating ? 'Checking...' : '✦ Enter'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TripForm;