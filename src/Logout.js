import React from 'react';
import { useNavigate } from 'react-router-dom';


const LogoutButton = () => {
    const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate("/login")
  };

  return (
    <button onClick={handleLogout} style={{ position: 'absolute', top: '10px', right: '10px' }}>Logout</button>
  );
};

export default LogoutButton;
