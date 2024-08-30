import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Email validation
        if (email === '') {
            setMessage('Please enter email');
            return;
        }

        // Valid Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setMessage('Please enter a valid email');
            return;
        }

        // Password validation
        if (password === '') {
            setMessage('Please enter password');
            return;
        }

        try {
            // Send login request to the server
            const response = await axios.post(`${apiUrl}/login`, { email, password });

            if (response.data.success) {
                // Store user information in localStorage
                const user = {
                    id: response.data.user.id,
                    fullname: response.data.user.fullname,
                    email: response.data.user.email
                };
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                // Navigate to login success page
                navigate('/loginsuccessful');
            } else {
                setMessage(response.data.message || 'Invalid email or password!');
            }
        } catch (error) {
            setMessage('Invalid email or password');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="container-small">
            <h1 className="text-center pageHeader">Login</h1>
            <form onSubmit={handleLogin} noValidate>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-default">Login</button>
            </form>
            <div className="mt-2">
                {message && <span className="error">{message}</span>}
            </div>
        </div>
    );
};

export default Login;
