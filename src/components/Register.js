import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const Register = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Full Name validation
        if (fullname === '') {
            setMessage('Please enter full name');
            return;
        }

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
        } else if (password.length < 8) {
            setMessage('Password must be at least 8 characters long');
            return;
        }

        // Confirm Password validation
        if (confirmPassword === '') {
            setMessage('Please confirm your password');
            return;
        } else if (password !== confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }

        try {
            // Make a POST request to the API endpoint
            const response = await axios.post(`${apiUrl}/users`, {
                fullname,
                email,
                password,
            });

            if (response.data.success) {
                // Clear form fields
                setFullname('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                navigate('/registersuccessful');
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred during registration');
        }
        
    };

    return (
        <div className="container-small">
            <h1 className="pageHeader">Register</h1>
            <form onSubmit={handleRegister} noValidate>
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input className="form-control" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn-default">Register</button>
            </form>
            <div className='mt-2'>{message && <span className="error">{message}</span>}</div>
        </div>
    );
};

export default Register;
