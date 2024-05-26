// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginClick = async () => {
        let resp = await fetch(`http://localhost:8080/api/shapes/painter/login`, {
            method: "POST",
            body: JSON.stringify({
                userName,
                password,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        if (resp.status === 200) {
            let data = await resp.json(); // Парсимо JSON-відповідь
            const userId = data.id; // Отримуємо id з відповіді
            localStorage.setItem("user_id", userId);
            console.log('Logged in Painter ID:', userId);
        
            // Використання navigate для переходу на сторінку /home
            navigate('/home');
        }
        
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Enter your username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLoginClick}>Login</button>
        </div>
    );
};

export default Login;
