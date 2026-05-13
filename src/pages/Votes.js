import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Votes() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVotes();
  }, [filter]);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/votes/?status=${filter}`);
      setVotes(response.data.results || response.data);
    } catch (err) {
      console.error('Błąd', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Głosowania</h1>
        <a href="/dashboard">← Wróć</a>
      </nav>

      <div className="container">
        <div className="form-group">
          <label>Filtr:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="open">Otwarte</option>
            <option value="closed">Zamknięte</option>
            <option value="draft">Szkice</option>
          </select>
        </div>

        {loading ? (
          <p>Ładowanie...</p>
        ) : votes.length === 0 ? (
          <p>Brak głosowań</p>
        ) : (
          votes.map((vote) => (
            <div key={vote.id} className="card">
              <h3>{vote.title}</h3>
              <p>{vote.description}</p>
              <p>Status: <strong>{vote.status}</strong></p>
              <button
                className="btn"
                onClick={() => navigate(`/votes/${vote.id}`)}
              >
                Szczegóły
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Votes;