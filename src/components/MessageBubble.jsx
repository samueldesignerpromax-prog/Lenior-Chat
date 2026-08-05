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
        background: isUser ? '#d4af37' : '#2a2a2a',
        color: isUser ? '#000' : '#fff',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
      }}>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message}
        </p>
      </div>
    </div>
  );
}
