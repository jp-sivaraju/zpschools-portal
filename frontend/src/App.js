import { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import SchoolDirectory from './pages/SchoolDirectory';
import SchoolDetails from './pages/SchoolDetails';
import AlumniPortal from './pages/AlumniPortal';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import EventsPage from './pages/EventsPage';
import DonationsPage from './pages/DonationsPage';
import ForumPage from './pages/ForumPage';
import NoticesPage from './pages/NoticesPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import { Toaster } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Auth Context
export const AuthContext = React.createContext(null);

// Theme Context
export const ThemeContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Apply theme to body
    document.body.className = theme === 'light' ? 'light-mode' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ZP School Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schools" element={<SchoolDirectory />} />
            <Route path="/schools/:id" element={<SchoolDetails />} />
            <Route path="/alumni" element={<AlumniPortal />} />
            <Route path="/admin" element={user?.role === 'admin' || user?.role === 'meo' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/dashboard" element={user ? <UserDashboard /> : <Navigate to="/" />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/donations" element={<DonationsPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/notices" element={<NoticesPage />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
            <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </div>
    </AuthContext.Provider>
  );
}

import React from 'react';
export default App;
