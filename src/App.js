import './App.css';
import Home from './Home';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user_id'));

  useEffect(() => {
    const user_id = localStorage.getItem('user_id');
    console.log("user ", user_id)
    if (!isLoggedIn && !user_id) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
