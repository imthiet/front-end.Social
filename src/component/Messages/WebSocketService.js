import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketService = (url, onMessageReceived) => {
  const client = new Client({
    brokerURL: url,
    connectHeaders: {
      // Thêm các header nếu cần thiết, ví dụ Authorization
    },
    debug: (str) => {
      console.log(str); // Debugging kết nối WebSocket
    },
    onConnect: () => {
      // Khi kết nối thành công
      console.log('WebSocket Connected!');
      client.subscribe('/topic/chat', (message) => {
        if (onMessageReceived) {
          onMessageReceived(JSON.parse(message.body));
        }
      });
    },
    onStompError: (frame) => {
      console.error('STOMP Error:', frame);
    },
    webSocketFactory: () => new SockJS('http://localhost:8080/websocket'),
  });

  client.activate();

  return {
    sendMessage: (message) => {
      if (client.connected) {
        client.publish({
          destination: '/app/sendMessage',  // Đường dẫn gửi tin nhắn
          body: JSON.stringify(message),
        });
      }
    },
  };
};

export default WebSocketService;
