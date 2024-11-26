import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import ChatBox from './ChatBox'; // Import ChatBox component
import './Messages.css';

function Messages() {
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user

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
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
};
  const handleDeleteMsg = () => {
    console.log("Message Click");
    // Thực hiện hành động khi người dùng click vào "Report"
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
                  onClick={() => setSelectedUser(user)} // Set selected user on click
                >
                  <div className="post-container">
                     {/* Dropdown */}
                  <div className="dropdown-container">
                    <button className="dropdown-toggle" onClick={toggleDropdown}>
                      ⋮
                    </button>
                    <ul className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
                      <li onClick={handleDeleteMsg}>Delete Msg</li>
                    </ul>
                  </div>
                    <h4>{user.username}</h4>
                    <p>{user.lastMessageContent || "No message"}</p>
                    <p className="author">
                      at {user.lastMessageTimestamp && new Date(user.lastMessageTimestamp).toLocaleString()}
                    </p>
                    <div className="post-icons">
                      <img
                        src={require('../../assets/images/message.png')}
                        alt="Message Icon"
                        className="icon"
                      />
                      <span>View Chat</span>
                    </div>
                   
                  </div>

                  
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    
  

      {/* ChatBox will show when a user is selected */}
      {selectedUser && (
        <div className="chatbox-container">
         <ChatBox user={selectedUser} onClose={() => setSelectedUser(null)} />
        </div>
      )}
    </div>
  );
}

export default Messages;
