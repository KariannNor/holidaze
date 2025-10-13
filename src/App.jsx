// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VenueDetailsPage from './pages/VenueDetailsPage';
import Profile from './pages/Profile';
import ManageVenues from './pages/ManageVenue';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/venues/:id" element={<VenueDetailsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/manage-venues" element={<ManageVenues />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;