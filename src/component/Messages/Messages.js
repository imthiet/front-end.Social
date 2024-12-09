import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import ChatBox from './ChatBox'; // Import ChatBox component
import './Messages.css';

function Messages() {
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

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

  useEffect(() => {
    const script = document.createElement('script');
    <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(selectedUser === user ? null : user);
  };

  return (
    <div className="maincontroller">
      <Navbar />
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
                  <div className="post-container">
                    <h4>{user.username}</h4>
                    <p>{user.lastMessageContent || 'No message'}</p>
                    <p className="author">
                      at{' '}
                      {user.lastMessageTimestamp &&
                        new Date(user.lastMessageTimestamp).toLocaleString()}
                    </p>
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


<df-messenger
  intent="WELCOME"
  chat-title="social_chatbot"
  agent-id="f7ea61e7-bbdc-4569-92f4-9b8d1a902267"
  language-code="en"
></df-messenger>
    </div>
  );
}

export default Messages;
