import React, { useState, useRef, useEffect } from 'react';
import api, { API_URL } from '../api';
import MessageBubble from '../components/MessageBubble';
import AudioRecorder from '../components/AudioRecorder';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem('lenior_session') || null;
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateSession = (newSessionId) => {
    if (newSessionId) {
      setSessionId(newSessionId);
      localStorage.setItem('lenior_session', newSessionId);
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMessage = text.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInput('');
    setLoading(true);

    try {
      console.log('📤 Enviando para:', `${API_URL}/chat/texto`);
      const payload = { texto: userMessage };
      if (sessionId) payload.sessao_id = sessionId;

      const res = await api.post('/chat/texto', payload);
      console.log('📥 Resposta completa:', res);
      console.log('📥 Dados da resposta:', res.data);

      // Tenta extrair a resposta de diferentes formatos
      const botReply = res.data?.resposta || 
                       res.data?.answer || 
                       res.data?.mensagem || 
                       res.data?.response ||
                       JSON.stringify(res.data);

      if (res.data?.sessao_id) {
        updateSession(res.data.sessao_id);
      }

      setMessages(prev => [...prev, { text: botReply, isUser: false }]);
    } catch (err) {
      console.error('❌ Erro completo:', err);
      console.error('❌ Response do erro:', err.response);
      console.error('❌ Dados do erro:', err.response?.data);
      
      const errorMsg = err.response?.data?.erro || 
                       err.response?.data?.detail || 
                       err.response?.data?.message ||
                       'Erro ao conectar com a IA';
      toast.error(errorMsg);
      setMessages(prev => [...prev, { text: `❌ ${errorMsg}`, isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleAudioSend = async (formData) => {
    setLoading(true);
    setMessages(prev => [...prev, { text: '🎤 Enviei um áudio...', isUser: true }]);

    try {
      if (sessionId) formData.append('sessao_id', sessionId);
      const res = await api.post('/chat/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('📥 Resposta áudio:', res.data);
      
      const botReply = res.data?.resposta || 
                       res.data?.answer || 
                       res.data?.mensagem || 
                       JSON.stringify(res.data);
      
      if (res.data?.sessao_id) {
        updateSession(res.data.sessao_id);
      }
      setMessages(prev => [...prev, { text: botReply, isUser: false }]);
    } catch (err) {
      console.error('❌ Erro áudio:', err);
      const errorMsg = err.response?.data?.erro || 
                       err.response?.data?.detail || 
                       'Erro ao processar áudio';
      toast.error(errorMsg);
      setMessages(prev => [...prev, { text: `❌ ${errorMsg}`, isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ color: '#d4af37' }}>💬 Conversar com Lenior</h2>
          {sessionId && (
            <p style={{ color: '#666', fontSize: '0.8rem' }}>
              Sessão: {sessionId.slice(0, 12)}...
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: '0.85rem' }}>
            {loading ? <FaSpinner className="spinner" style={{ animation: 'spin 1s linear infinite' }} /> : '🟢 Online'}
          </span>
          <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>

      <div className="card" style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        marginBottom: '16px',
        minHeight: '300px',
        maxHeight: '500px',
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
            <p style={{ fontSize: '1.2rem' }}>🧠 Pergunte algo para Lenior</p>
            <p style={{ fontSize: '0.9rem' }}>Digite uma mensagem ou grave um áudio</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg.text} isUser={msg.isUser} />
          ))
        )}
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: '#2a2a2a', padding: '10px 18px', borderRadius: '18px', marginTop: '4px' }}>
            <div className="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          disabled={loading}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <button type="submit" className="btn-primary" disabled={loading || !input.trim()} style={{ padding: '10px 20px' }}>
          <FaPaperPlane />
        </button>
        <AudioRecorder onAudioSend={handleAudioSend} disabled={loading} />
      </form>

      <p style={{ color: '#555', fontSize: '0.75rem', marginTop: '10px', textAlign: 'center' }}>
        Lenior é uma IA assistente. Suporte a texto e áudio. 
        <a href={API_URL + '/status'} target="_blank" rel="noopener noreferrer" style={{ color: '#d4af37', marginLeft: '6px' }}>
          Ver status da API
        </a>
      </p>
    </div>
  );
}
