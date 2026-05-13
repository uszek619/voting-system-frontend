import React, { useState } from 'react';
import api from '../api';

function Attendance() {
  const [meetingDate, setMeetingDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirmAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/attendance/confirm_attendance/', {
        meeting_date: meetingDate,
      });
      setMessage('Frekwencja potwierdzona!');
      setMeetingDate('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Błąd przy potwierdzaniu frekwencji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Frekwencja</h1>
        <a href="/dashboard">← Wróć</a>
      </nav>

      <div className="container">
        <div className="card">
          <h2>Potwierdź swoją obecność</h2>

          {message && (
            <div className={`alert ${message.includes('potwierdzona') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleConfirmAttendance}>
            <div className="form-group">
              <label>Data posiedzenia:</label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Potwierdzam...' : 'Potwierdź obecność'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Attendance;