import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegisterClick = async () => {
    try {
      const resp = await fetch(`http://localhost:8080/api/shapes/painter/register`, {
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
        const data = await resp.json(); // Парсимо JSON-відповідь
        const userId = data.id; // Отримуємо id з відповіді
        localStorage.setItem('user', JSON.stringify({ "username":userName, "user_id":userId }));

        console.log('Logged in Painter ID:', userId);

        // Використання navigate для переходу на сторінку /home
        navigate('/home');
      } else if (resp.status === 500) {
        setError('User with this username already exists');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className='login_button' onClick={handleRegisterClick}>Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default Register;
