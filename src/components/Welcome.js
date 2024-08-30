import React from 'react';
import { Link } from 'react-router-dom';
const Welcome = () => {
    return (
        <>
            <div className="container-small text-center welcome">
                <h1 className="pageHeader">Welcome to Users Module</h1>
                <p><strong>Existing Users</strong></p>
                <Link className="btn btn-default" to="/login">Login</Link>
                <p><strong>New Users</strong></p>
                <Link className="btn btn-default" to="/register">Register</Link>
            </div>
        </>
    );
}

export default Welcome;
