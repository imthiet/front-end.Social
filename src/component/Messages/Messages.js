import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import timeAgo from '../../Ago';
import ChatBox from './ChatBox'; // Import ChatBox component
import './Messages.css';

import '../notice/notice.css';  
import { showAlert } from '../notice/notice.js';  

function Messages() {
    const [usersWithMessages, setUsersWithMessages] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteMessageId, setDeleteMessageId] = useState(null); // ID of message to delete

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('http://localhost:8080/messages', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsersWithMessages(data);
                } else {
                    setError('Failed to load messages');
                }
            } catch (error) {
                setError('Error fetching messages');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const handleUserClick = (user) => {
        setSelectedUser(selectedUser === user ? null : user);
    };

    const handleDeleteMsg = async (chatId) => {
        if (window.confirm('Are you sure to delete this message?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/chat/delete/${chatId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    showAlert("Deleted Message!");

                    setUsersWithMessages((prev) =>
                        prev.filter((user) => user.chatId !== chatId)
                    );
                   
                    // console.log("Delete chat");
                } else {
                    console.error('Failed to delete message');
                }
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    };

    return (
        <div className="maincontroller">
            <Navbar />
            <div id="notification" className="notification hidden" >
                <span id="notification-message"></span>
            </div>
            <div className="messages-container">
                {error && <p>{error}</p>}
                {isLoading ? (
                    <div className="loader"></div>
                ) : (
                    <ul className="message-list">
                        {usersWithMessages.length === 0 ? (
                            <p>No messages available</p>
                        ) : (
                            usersWithMessages.map((user, index) => (
                                <li
                                    key={index}
                                    className="message-item"
                                    onClick={() => handleUserClick(user)} // Set selected user on click
                                >
                                    <div className="msg-container">
                                        <h4>{user.username}</h4>
                                        <p className='lastMsg'>{user.lastMessageContent || 'No message'}</p>
                                        <p className="author"> {' '} {user.lastMessageTimestamp && timeAgo(user.lastMessageTimestamp)} </p>
                                        <div className="post-icons">
                                            <img
                                                src={require('../../assets/images/message.png')}
                                                alt="Message Icon"
                                                className="icon"
                                            />
                                            <span>View Chat</span>
                                            {/* Delete Icon */}
                                            <button
                                                className="delete-icon"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent triggering parent click
                                                    handleDeleteMsg(user.chatId); // Pass message ID to delete
                                                }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>

            {selectedUser && (
                <div className="chatbox-container">
                    <ChatBox user={selectedUser} onClose={() => setSelectedUser(null)} />
                </div>
            )}
        </div>
    );
}

export default Messages;
