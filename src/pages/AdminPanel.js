import React, { useState, useEffect } from 'react';
import api from '../api';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: '',
    username: '',
    first_name: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data.results || response.data);
    } catch (err) {
      console.error('Błąd', err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      await api.post('/users/', {
        ...newUser,
        role: 'user',
      });
      setMessage('Użytkownik utworzony!');
      setNewUser({ email: '', username: '', first_name: '' });
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Błąd przy tworzeniu użytkownika');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Panel Administratora</h1>
        <a href="/dashboard">← Wróć</a>
      </nav>

      <div className="container">
        <div style={{ marginBottom: '20px' }}>
          <button
            className={`btn ${activeTab === 'users' ? '' : 'btn-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            Użytkownicy
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('Błąd') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="card">
              <h2>Utwórz nowego użytkownika</h2>
              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Login:</label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Imię:</label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, first_name: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-success">
                  Utwórz użytkownika
                </button>
              </form>
            </div>

            <h2>Lista użytkowników</h2>
            {users.map((user) => (
              <div key={user.id} className="card">
                <h4>{user.email}</h4>
                <p>
                  Login: <strong>{user.username}</strong>
                </p>
                <p>
                  Rola: <strong>{user.role}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;