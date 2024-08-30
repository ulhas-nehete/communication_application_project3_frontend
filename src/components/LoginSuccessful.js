import React from 'react';

const LoginSuccess = () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    return (
        <div className="text-center">
            <h1 className="pageHeader">Login Successful</h1>
            <p><strong>Welcome ! </strong> <span>{user.email}</span></p>           
        </div>
    );
};

export default LoginSuccess;
