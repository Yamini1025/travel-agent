import './SearchPopup.css';

function SearchPopup() {
  return (
    <div className="search-popup-backdrop">
      <div className="search-popup">
        <div className="loading-spinner"></div>

        <h2>Finding your options...</h2>

        <p>
          We're searching for flights and hotels for your trip.
        </p>
      </div>
    </div>
  );
}

export default SearchPopup;