import React from 'react';

const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      <div className="avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
