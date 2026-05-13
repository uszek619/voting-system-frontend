import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Votes from './pages/Votes';
import VoteDetails from './pages/VoteDetails';
import Attendance from './pages/Attendance';
import AdminPanel from './pages/AdminPanel';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
      // Pobierz dane użytkownika
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/votes" element={isAuthenticated ? <Votes /> : <Navigate to="/login" />} />
        <Route path="/votes/:id" element={isAuthenticated ? <VoteDetails /> : <Navigate to="/login" />} />
        <Route path="/attendance" element={isAuthenticated ? <Attendance /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;