import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import TripItinerary from './components/TripItinerary';
import './App.css';

function App() {
    const [trips, setTrips] = useState(() => {
        const savedTrips = localStorage.getItem('trips');
        return savedTrips ? JSON.parse(savedTrips) : [];
    });

    useEffect(() => {
        localStorage.setItem('trips', JSON.stringify(trips))
    }, [trips]);

    return (
        <Routes>
            <Route path="/" element={<Homepage trips={trips} setTrips={setTrips}/>}/>
            <Route path="/itinerary/:tripId" element={<TripItinerary trips={trips}/>}/>
        </Routes>
    );
}

export default App;