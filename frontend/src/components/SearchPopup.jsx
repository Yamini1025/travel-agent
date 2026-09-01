import './SearchPopup.css';

function SearchPopup() {
  return (
    <div className="search-popup-backdrop">
      <div className="search-popup">
        <div className="loading-spinner"></div>

        <h2>Finding the best flight and hotel options...</h2>

        <p>
          Please give us a moment.
        </p>
      </div>
    </div>
  );
}

export default SearchPopup;