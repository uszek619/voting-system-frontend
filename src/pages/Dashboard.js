import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Dashboard({ user }) {
  const [userData, setUserData] = useState(null);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchVotes();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/users/me/');
      setUserData(response.data);
    } catch (err) {
      console.error('Błąd przy pobieraniu danych', err);
    }
  };

  const fetchVotes = async () => {
    try {
      const response = await api.get('/votes/?status=open');
      setVotes(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      console.error('Błąd przy pobieraniu głosowań', err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <h1>🗳️ System Głosowania</h1>
        <div>
          <a href="/votes">Głosowania</a>
          <a href="/attendance">Frekwencja</a>
          {userData?.role === 'admin' && <a href="/admin">Admin Panel</a>}
          <button onClick={handleLogout} className="btn">
            Wyloguj się
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <h2>Witaj, {userData?.first_name || userData?.email}!</h2>
          <p>Rola: <strong>{userData?.role}</strong></p>
          {userData?.organization && (
            <p>Organizacja: <strong>{userData.organization}</strong></p>
          )}
        </div>

        <h2>Otwarte Głosowania</h2>
        {loading ? (
          <p>Ładowanie...</p>
        ) : votes.length === 0 ? (
          <p>Brak otwartych głosowań</p>
        ) : (
          votes.map((vote) => (
            <div key={vote.id} className="card">
              <h3>{vote.title}</h3>
              <p>{vote.description}</p>
              <p>
                Uczestniczących: <strong>{vote.participants_count}</strong>
              </p>
              <button
                className="btn"
                onClick={() => navigate(`/votes/${vote.id}`)}
              >
                Przejdź do głosowania
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;