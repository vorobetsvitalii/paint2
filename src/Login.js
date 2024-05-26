// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'lightblue',
    borderRadius: '5px',
  },
  input: {
    marginBottom: '10px',
    padding: '8px',
    borderRadius: '3px',
    border: '1px solid #ccc',
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    let resp = await fetch(`http://localhost:8080/api/shapes/painter/login`, {
      method: 'POST',
      body: JSON.stringify({
        userName,
        password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (resp.status === 200) {
      let data = await resp.json(); // Парсимо JSON-відповідь
      const userId = data.id; // Отримуємо id з відповіді
      localStorage.setItem('user_id', userId);
      console.log('Logged in Painter ID:', userId);

      // Використання navigate для переходу на сторінку /home
      navigate('/home');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button style={styles.button} onClick={handleLoginClick}>
        Login
      </button>
      <p onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>
        Don't have an account? Register here.
      </p>
    </div>
  );
};

export default Login;
