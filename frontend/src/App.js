import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages (to be created)
// import WorldBook from './pages/WorldBook/WorldBook';
// import AdventurersBook from './pages/AdventurersBook/AdventurersBook';
// import StoryBook from './pages/StoryBook/StoryBook';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Plot Hook</h1>
          <p>D&D World-Building Tool</p>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<div>Welcome to Plot Hook!</div>} />
            {/* Add routes for the three books when components are created */}
            {/* <Route path="/world-book" element={<WorldBook />} /> */}
            {/* <Route path="/adventurers-book" element={<AdventurersBook />} /> */}
            {/* <Route path="/story-book" element={<StoryBook />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 