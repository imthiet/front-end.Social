import React, { useState, useEffect } from 'react';
import './Login.css'; // Custom CSS for styling adjustments
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import backgroundImage from '../../assets/images/backgr.png'; // Background image import

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    
    const navigate = useNavigate();

    // Auto scroll to bottom-right on page load
    useEffect(() => {
        window.scrollTo({
            top: document.body.scrollHeight, // Cuộn đến cuối height
            left: document.body.scrollWidth, // Cuộn đến cuối width
            behavior: 'smooth', // Hiệu ứng mượt mà
        });
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });
    
            if (!response.ok) {
                const errorData = await response.text(); // Lấy lỗi từ server
                throw new Error(errorData);
            }
    
            const data = await response.json();
    
            localStorage.setItem('auth', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('isAdmin', data.isAdmin);
            localStorage.setItem('userId', data.userId);
            navigate('/Newsfeed');
        } catch (err) {
            setError(err.message); // Hiển thị lỗi từ server
        } finally {
            setLoading(false);
        }
    };

    const togglePassword = () => setPasswordVisible(!passwordVisible);

    return (
        <div 
            className="login-background" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
            id='root'
        >
            <form onSubmit={handleLogin} className="login-form">
                <h2 className="text-center mb-4 Title">Welcome to Now Feed</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <div className="form-group mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                        required
                        minLength="6"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            required
                            minLength="6"
                        />
                        <span className="input-group-text" onClick={togglePassword}>
                            <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
                        </span>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>

                <div className="text-center mt-3">
                    <small>
                        Don't have an account? <a href="/signup" className="text-decoration-underline">Sign Up</a>
                    </small>
                </div>
            </form>
        </div>
    );
};

export default Login;
