import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { FaArrowUp, FaStop } from 'react-icons/fa';
import AudioRecorder from '../components/AudioRecorder';
import MessageBubble from '../components/MessageBubble';
import api from '../api';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('lenior_session_id');
    if (stored) setSessionId(stored);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = text.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const payload = { texto: userMessage };
      if (sessionId) payload.sessao_id = sessionId;

      const response = await api.post('/chat/texto', payload);

      // Verifica se a resposta tem o campo esperado
      const botReply = response.data?.resposta || 'Desculpe, não entendi a resposta.';

      if (response.data?.sessao_id) {
        const newSession = response.data.sessao_id;
        setSessionId(newSession);
        localStorage.setItem('lenior_session_id', newSession);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error('Erro no envio:', error);
      // Mostra mensagem de erro amigável
      let errorMsg = 'Erro ao enviar mensagem. Tente novamente.';
      if (error.response?.status === 500) {
        errorMsg = 'O servidor está com problemas. Tente mais tarde.';
      } else if (error.code === 'ECONNABORTED') {
        errorMsg = 'A requisição demorou muito. Verifique sua internet.';
      } else if (!error.response) {
        errorMsg = 'Não foi possível conectar ao servidor. Verifique sua internet.';
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioSend = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      if (sessionId) formData.append('sessao_id', sessionId);

      const response = await api.post('/chat/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const botReply = response.data?.resposta || 'Desculpe, não entendi o áudio.';

      if (response.data?.sessao_id) {
        const newSession = response.data.sessao_id;
        setSessionId(newSession);
        localStorage.setItem('lenior_session_id', newSession);
      }

      if (response.data?.texto_transcrito) {
        setMessages((prev) => [
          ...prev,
          { role: 'user', content: `🎤 ${response.data.texto_transcrito}` },
        ]);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar áudio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        {messages.length === 0 ? (
          <div className="empty-state">
            <h2>👋 Olá! Sou o Lenior</h2>
            <p>Como posso ajudar você hoje?</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role} content={msg.content} />
          ))
        )}
        {loading && (
          <div className="loading-indicator">
            <span>Lenior está pensando...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <AudioRecorder onSend={handleAudioSend} disabled={loading} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) sendMessage(input);
          }}
          placeholder="Digite sua mensagem..."
          disabled={loading}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="send-button"
        >
          {loading ? <FaStop /> : <FaArrowUp />}
        </button>
      </div>
    </div>
  );
};

export default Chat;
