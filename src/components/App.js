
import React from 'react';

import Nav from './Nav';
import Welcome from './Welcome';
import Login from './Login';
import LoginSuccessful from './LoginSuccessful';
import Register from './Register';
import RegisterSuccessful from './RegisterSuccessful';
import ChatList from './ChatList';
import UserList from './UserList';
import DocumentList from './DocumentList';
import NotFound from './NotFound';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../styles/index.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (<BrowserRouter>
        <Routes>
            <Route path="/" element={<Nav />}>
                <Route path="loginsuccessful" element={<LoginSuccessful />} />
                <Route path="chatlist" element={<ChatList />} />
                <Route path="users" element={<UserList />} />
                <Route path="documentlist" element={<DocumentList />} />
            </Route>
            <Route index element={<Welcome />} />
            <Route path="welcome" element={<Welcome />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="registersuccessful" element={<RegisterSuccessful />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </BrowserRouter>
    );
}

export default App;
