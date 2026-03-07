import React, { useState, useEffect } from 'react';
import axios from 'axios';


    //run with this command in terminal: powershell -ExecutionPolicy Bypass -Command "npm start"



function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  // Check for existing "Session" on load
  useEffect(() => {
    const savedUser = localStorage.getItem('userSession');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = view === 'login' ? 'login' : 'register';
    try {
      const res = await axios.post(`http://localhost:8080/api/auth/${endpoint}`, formData);

      if (view === 'register') {
        alert(res.data.message);
        setView('login');
      } else {
        localStorage.setItem('userSession', JSON.stringify(res.data));
        setUser(res.data);
        setView('dashboard');
        alert("Paldo ang boang!");
      }
    } catch (err) {
      const errorMsg = typeof err.response?.data === 'string'
        ? err.response.data
        : "Error: Please check backend connection.";
      alert(errorMsg);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setUser(null);
    setView('login');
  };

  if (view === 'dashboard') {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
        <h1>Dashboard</h1>
        <div style={{ border: '2px solid #28a745', padding: '20px', display: 'inline-block', borderRadius: '10px' }}>
          <h2>Welcome, {user?.username}!</h2>
          <p>Email: {user?.email}</p>
          <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
      <h1>{view === 'login' ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleAuth} style={{ display: 'inline-block', textAlign: 'left', border: '1px solid #ccc', padding: '20px' }}>
        {view === 'register' && (
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label><br/>
            <input type="email" onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label><br/>
          <input type="text" onChange={e => setFormData({...formData, username: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Password:</label><br/>
          <input type="password" onChange={e => setFormData({...formData, password: e.target.value})} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          {view === 'login' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      <p onClick={() => setView(view === 'login' ? 'register' : 'login')} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', marginTop: '10px' }}>
        {view === 'login' ? "Wala pakay account? Register." : "Naa nakay account? Login."}
      </p>
    </div>
  );
}

export default App;