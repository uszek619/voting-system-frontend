import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function VoteDetails() {
  const { id } = useParams();
  const [vote, setVote] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVote();
  }, [id]);

  const fetchVote = async () => {
    try {
      const response = await api.get(`/votes/${id}/`);
      setVote(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Błąd', err);
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) {
      setMessage('Proszę wybrać opcję');
      return;
    }

    try {
      await api.post(`/votes/${id}/cast_vote/`, {
        vote_option_id: selectedOption,
      });
      setMessage('Głos oddany!');
      setVoted(true);
      setTimeout(() => navigate('/votes'), 2000);
    } catch (err) {
      setMessage('Błąd przy oddawaniu głosu');
    }
  };

  const handleViewResults = async () => {
    try {
      const response = await api.get(`/votes/${id}/results/`);
      setVote(response.data);
    } catch (err) {
      console.error('Błąd', err);
    }
  };

  if (loading) return <div className="container"><p>Ładowanie...</p></div>;
  if (!vote) return <div className="container"><p>Głosowanie nie znalezione</p></div>;

  return (
    <div>
      <nav className="navbar">
        <h1>{vote.title}</h1>
        <a href="/votes">← Wróć</a>
      </nav>

      <div className="container">
        <div className="card">
          <h2>{vote.title}</h2>
          <p>{vote.description}</p>
          <p>Status: <strong>{vote.status}</strong></p>
          <p>Typ: <strong>{vote.vote_type}</strong></p>

          {message && (
            <div className={`alert ${voted ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          {vote.status === 'open' && !voted && (
            <div>
              <h3>Opcje:</h3>
              {vote.options?.map((option) => (
                <div
                  key={option.id}
                  className={`vote-option ${selectedOption === option.id ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  {option.text}
                </div>
              ))}
              <button
                className="btn btn-success"
                onClick={handleVote}
                disabled={voted}
              >
                Oddaj głos
              </button>
            </div>
          )}

          {vote.status === 'closed' && (
            <div>
              <h3>Wyniki:</h3>
              <div className="vote-results">
                {vote.options?.map((option) => (
                  <div key={option.id} className="result-bar">
                    <div className="result-label">{option.text}</div>
                    <div className="result-progress">
                      <div
                        className="result-fill"
                        style={{
                          width: `${option.percentage || 0}%`,
                        }}
                      >
                        {option.percentage?.toFixed(1)}%
                      </div>
                    </div>
                    <div className="result-votes">{option.votes} głosów</div>
                  </div>
                ))}
              </div>
              <p>
                Uczestnictwo: <strong>{vote.participation_rate?.toFixed(1)}%</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoteDetails;