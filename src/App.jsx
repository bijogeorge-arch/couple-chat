import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import EnhancedLandingPage from './components/EnhancedLandingPage';
import Room from './components/Room';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="transition-opacity duration-700">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<EnhancedLandingPage />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
