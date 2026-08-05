import React from 'react';

export default function MessageBubble({ message, isUser }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
    }}>
      <div className={`card ${isUser ? 'message-user' : 'message-bot'}`} style={{
        maxWidth: '80%',
        padding: '12px 18px',
        border: 'none',
        boxShadow: 'none',
      }}>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message}
        </p>
      </div>
    </div>
  );
}
