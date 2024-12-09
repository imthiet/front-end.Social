import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './ChatBox.css';
import axios from 'axios';

function ChatBox({ user, onClose }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const size = 8; // Số lượng tin nhắn mỗi lần tải
    const messagesRef = useRef(null);
    const scrollTopBeforeFetch = useRef(0); // Lưu vị trí scroll trước khi load thêm
    const stompClient = useRef(null);
    const own_name = localStorage.getItem('username');

    // Hàm fetch tin nhắn từ API
    const fetchMessages = async (page = 0, size = 8) => {
      try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8080/api/chat/${user.chatId}`, {
              params: { page, size },
              withCredentials: true,
          });
          const newMessages = response.data.content;
  
          setMessages((prevMessages) => {
              const combinedMessages = [ ...prevMessages,...newMessages,];
              const uniqueMessages = combinedMessages.reduce((acc, message) => {
                  if (!acc.find((m) => m.id === message.id)) {
                      acc.push(message);
                  }
                  return acc;
              }, []);
              return uniqueMessages;
          });
  
          if (newMessages.length === 0) {
              setHasMore(false);
          }
      } catch (error) {
          console.error('Error fetching messages:', error);
      } finally {
          setLoading(false);
      }
  };
  

    // Kết nối WebSocket và lắng nghe tin nhắn mới
    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");
                client.subscribe(`/topic/chat/${user.chatId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [newMessage, ...prevMessages]);
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

    // Lấy tin nhắn ban đầu
    useEffect(() => {
        fetchMessages(page);
    }, [user.chatId, page]);

    // Lưu vị trí scroll trước khi load thêm
    useEffect(() => {
        if (loading && messagesRef.current) {
            scrollTopBeforeFetch.current = messagesRef.current.scrollTop;
        }
    }, [loading]);

    // Đặt lại vị trí scroll sau khi load thêm
    useEffect(() => {
        if (!loading && messagesRef.current && scrollTopBeforeFetch.current !== null) {
            messagesRef.current.scrollTop =
                messagesRef.current.scrollHeight - scrollTopBeforeFetch.current;
            scrollTopBeforeFetch.current = null;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() && stompClient.current && stompClient.current.connected) {
            const message = {
                content: newMessage,
                senderId: localStorage.getItem('userId'),
                senderUsername: own_name,
                receiverId: user.userId,
                chatId: user.chatId,
            };

            stompClient.current.publish({
                destination: `/app/chat/${user.chatId}/sendMessage`,
                body: JSON.stringify(message),
            });
            setNewMessage('');
        } else {
            console.error("WebSocket is not connected");
        }
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            setPage((prevPage) => prevPage + 1); // Tăng số trang
        }
    };

    return (
        <div className="chatbox">
            <h4>{user.username}</h4>
            <button className="close-button" onClick={onClose}>
                ×
            </button>
            <button className="load-more-button" onClick={handleLoadMore} disabled={loading}>
                ↑ Load More
            </button>

            {loading && <div className="loader"></div>}

            <div className="messages" ref={messagesRef}>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.senderUsername !== user.username ? 'sent' : 'receiver'}`}
                    >
                        <strong>{message.senderUsername}</strong> {message.content}
                        <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
                    </div>
                ))}
            </div>

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
};

export default ChatBox;
