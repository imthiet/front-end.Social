import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './ChatBox.css';
import axios from 'axios';

function ChatBox({ user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const stompClient = useRef(null);
  const own_name = localStorage.getItem('username');
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/chat/${user.chatId}`, {
        withCredentials: true,
        
      });
      setMessages(response.data.content);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket");
        client.subscribe(`/topic/chat/${user.chatId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          console.log("Received new message:", newMessage);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        
      },
      onDisconnect: () => console.log("Disconnected from WebSocket"),
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [user.chatId]);

  useEffect(() => {
    fetchMessages();
  }, [user.chatId]);

  const handleSendMessage = () => {
    if (newMessage.trim() && stompClient.current && stompClient.current.connected) {
      const message = {
        content: newMessage,
        senderId: localStorage.getItem('userId'), // ID sender
        senderUsername: own_name,          // Username local
        receiverId: user.userId,                // ID người nhận
        chatId: user.chatId,                    // ID chat
      };
  
      // Gửi tin nhắn qua WebSocket
      stompClient.current.publish({
        destination: `/app/chat/${user.chatId}/sendMessage`,
        body: JSON.stringify(message),
      });
  
      // Clear input
      setNewMessage('');
    } else {
      console.error("WebSocket is not connected");
    }
  };
  
  
  
  return (
    <div className="chatbox">
      <h4>{user.username}</h4>
      <button className="close-button" onClick={onClose}>
        =
      </button>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="messages">
          {messages.slice().reverse().map((message, index) => (
            <div
              key={index}
              className={`message ${message.senderUsername !== user.username ? 'sent' : 'receiver'}`}
            >
              <strong>{message.senderUsername}</strong> {message.content}
              <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      <div className="message-input">
        <input
          className="input-msg"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message..."
        />
        <button className="sentbtn" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
