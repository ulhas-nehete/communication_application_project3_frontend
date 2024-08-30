import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const GroupChat = () => {
    const [userChatMessage, setUserChatMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [error, setError] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Fetch all chat messages from the server
        const fetchChatMessages = async () => {
            try {
                const response = await axios.get(`${apiUrl}/chats`);
                setChatMessages(response.data);
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            }
        };

        fetchChatMessages();

        // Get the logged-in user from localStorage
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user && user.fullname) {
            setLoggedInUser(user);
        }

    }, []);

    // Scroll to the bottom of the chat container
    useEffect(() => {        
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const formatDateTime = (date) => {
        return date.toLocaleString();
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        // Message Validation
        if (userChatMessage === '') {
            setError('Please enter a message');
            return;
        }

        const dateTime = formatDateTime(new Date());

        const chatMessage = {
            dateTime: dateTime,
            fullname: loggedInUser.fullname,
            userChatMessage: userChatMessage,
        };

        try {
            // Send the message to the server
            const response = await axios.post(`${apiUrl}/chats`, chatMessage);

            // Update chat messages in state with the response from the server
            setChatMessages([...chatMessages, response.data]);

            // Clear the input
            setUserChatMessage('');
            setError('');
        } catch (error) {
            console.error('Error sending chat message:', error);
            setError('Failed to send message. Please try again.');
        }
    };

    // Refresh the page
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <>
            <h1 className="text-left pageHeader">Group Chat</h1>
            <div className="chatBox">
                <div className="chatMessageBlock" ref={chatContainerRef}>
                    {chatMessages.map((message, index) => (
                        <div key={index} className={`chat-message ${loggedInUser && message.fullname === loggedInUser.fullname ? 'message-right' : ''}`}>
                            <div className="text-message"> <span>[{message.datetime}]</span> <strong>{message.fullname} : </strong> {message.message}</div>
                        </div>
                    ))}
                </div>
                <div className="chatForm">
                    <form onSubmit={handleSendMessage}>
                        {loggedInUser && (
                            <strong className="fullname">{loggedInUser.fullname}</strong>
                        )}
                        <div className="w-100">
                            <input
                                type="text"
                                id="userChatMessage"
                                value={userChatMessage}
                                onChange={(e) => setUserChatMessage(e.target.value)}
                                placeholder="Type here..."
                                className="form-control"
                            />
                            {error && <span className="error">{error}</span>}
                        </div>
                        <button type="submit" className="btn btn-default">Send</button>
                        <button className="btn btn-default" onClick={handleRefresh}>Refresh</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default GroupChat;
