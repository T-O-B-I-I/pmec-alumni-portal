import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Directory from './pages/Directory';
import Profile from './pages/Profile';
import Gallery from './pages/Gallery';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import PublicProfile from './pages/PublicProfile';
import Mentors from './pages/Mentors';
import Footer from './components/Footer';

import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/mentors" element={<Mentors />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/superadmin" element={<SuperAdminDashboard />} />
              <Route path="/alumni/:id" element={<PublicProfile />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
