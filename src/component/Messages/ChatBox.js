import React, { useState, useEffect, useRef } from 'react';
import WebSocketService from './WebSocketService';
import './ChatBox.css';
import axios from 'axios';

function ChatBox({ user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesData, setMessagesData] = useState([]); // Store fetched messages

  const websocket = useRef(null); // Store WebSocket instance

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/chat/${user.chatId}`, {
        withCredentials: true,
      });
      const data = response.data.content;
      setMessagesData(data); // Save to messagesData state
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Initialize WebSocketService
    websocket.current = WebSocketService('http://localhost:8080/websocket', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup WebSocket on unmount
    return () => {
      if (websocket.current && websocket.current.client && websocket.current.client.deactivate) {
        websocket.current.client.deactivate();
      }
    };
  }, [user]);

  const handleSendMessage = () => {
    console.log(messagesData);

    // Ensure there's at least one message in messagesData to infer the receiverId
    if (newMessage.trim() && websocket.current && messagesData.length > 0) {
      const recentMessage = messagesData[messagesData.length - 1];

      const message = {
        content: newMessage,
        senderUsername: user.username,
        senderId: recentMessage.receiverId, // Assuming user.id is the sender's ID
        receiverId: recentMessage.senderId === user.id ? recentMessage.receiverId : recentMessage.senderId, // Determine receiverId based on last message
        chatId: user.chatId,
      };

      console.log(message);

      // Send the message through WebSocket
      websocket.current.sendMessage(message);
      setNewMessage('');
    }
  };

  return (
    <div className="chatbox">
      <h4>{user.username}</h4>
      <button className="close-button" onClick={onClose}>~</button>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.senderUsername === user.username ? 'receiver' : 'sent'}`}
            >
              <strong>{message.senderUsername}</strong>: {message.content}
              <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <div className="message-input">
        <input
          className='input-msg'
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message..."
        />
        <button className='sentbtn' onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;
