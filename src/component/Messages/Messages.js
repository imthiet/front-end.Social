import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Messages.css';

function Messages() {
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Lấy danh sách người dùng với tin nhắn khi load component
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/chat/messages', {
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
        setIsLoading(false); // Stop loading spinner after data is fetched
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className='maincontroller'>
        <Navbar/>

   
    <div className="messages-container">
           
     

      {/* Hiển thị lỗi nếu có */}
      {error && <p>{error}</p>}

      {/* Hiển thị loading spinner nếu đang tải dữ liệu */}
      {isLoading ? (
        <div className="spinner">
          <div className="loader"></div>
        </div>
      ) : (
        <ul className="message-list">
          {usersWithMessages.length === 0 ? (
            <p>No messages available</p>
          ) : (
            usersWithMessages.map((user, index) => (
              <li key={index} className="message-item">
                <Link to={`/chat/${user.username}`} className="message-link">
                  <div className="post-container">
                    {/* Tên người dùng */}
                    <h4>{user.username}</h4>

                    {/* Tin nhắn cuối cùng */}
                    <p>{user.lastMessageContent || "No message"}</p>

                    {/* Thời gian tin nhắn */}
                    <p className="author">
                      at {user.lastMessageTimestamp && new Date(user.lastMessageTimestamp).toLocaleString()}
                    </p>

                    {/* Các biểu tượng */}
                    <div className="post-icons">
                      <img
                        src={require('../../assets/images/message.png')}
                        alt="Message Icon"
                        className="icon"
                      />
                      <span>View Chat</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
    </div>
  );
}

export default Messages;
