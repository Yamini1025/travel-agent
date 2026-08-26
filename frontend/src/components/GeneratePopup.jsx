import './GeneratePopup.css';

function GeneratePopup({ trip, onClose }) {
  return (
    <div className="itinerary-popup">
      <div className="itinerary-content">
        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        {!trip && 
          <div className="loading-state">
            <h2>Generating your itinerary...</h2>
            <p>Please wait a few minutes while we plan your trip.</p>
          </div>
        }
      </div>
    </div>
  );
}

export default GeneratePopup;