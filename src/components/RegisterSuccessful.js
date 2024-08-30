import React from 'react';
import { Link } from 'react-router-dom';

const RegisterSuccess = () => {
    return (
        <div className="container-small text-center">
            <h1 className='pageHeader'>Registration Successful</h1>
            <p>Thank you for registration.</p>
            <Link to="/">Click to return to home page</Link>
        </div>
    );
};

export default RegisterSuccess;
