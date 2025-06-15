// client/src/Chat.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:3001');

function Chat() {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = () => {
    if (message !== '') {
      const msgData = {
        author: 'User',
        message: message,
        time: new Date(Date.now()).toLocaleTimeString(),
      };
      socket.emit('send_message', msgData);
      setMessageList([...messageList, msgData]);
      setMessage('');
    }
  };

  useEffect(() => {
  const handleReceiveMessage = (data) => {
    setMessageList((prevList) => [...prevList, data]);
  };

  socket.on('receive_message', handleReceiveMessage);

  return () => {
    socket.off('receive_message', handleReceiveMessage);
  };
}, []);


  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Real-Time Chat</h2>
      <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'scroll', padding: 10 }}>
        {messageList.map((msg, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <b>{msg.author}</b> [{msg.time}]: {msg.message}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', padding: 10, marginTop: 10 }}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} style={{ padding: 10, marginLeft: 10 }}>Send</button>
    </div>
  );
}

export default Chat;
