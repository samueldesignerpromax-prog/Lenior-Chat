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
    console.log('📥 Resposta:', res.data);

    const botReply = res.data?.resposta || res.data?.mensagem || JSON.stringify(res.data);
    if (res.data?.sessao_id) {
      updateSession(res.data.sessao_id);
    }
    setMessages(prev => [...prev, { text: botReply, isUser: false }]);
  } catch (err) {
    console.error('❌ Erro completo:', err);
    console.error('❌ Resposta do erro:', err.response?.data);
    const errorMsg = err.response?.data?.erro || err.response?.data?.detail || 'Erro ao conectar com a IA';
    toast.error(errorMsg);
    setMessages(prev => [...prev, { text: `❌ ${errorMsg}`, isUser: false }]);
  } finally {
    setLoading(false);
  }
};
