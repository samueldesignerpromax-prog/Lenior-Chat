const sendMessage = async (text) => {
  if (!text.trim()) return;

  const userMessage = text.trim();
  setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
  setInput('');
  setLoading(true);

  try {
    const payload = { texto: userMessage };
    if (sessionId) payload.sessao_id = sessionId;

    console.log('📦 Payload enviado:', payload);
    const response = await api.post('/chat/texto', payload);
    console.log('📩 Resposta recebida:', response.data);

    const botReply =
      response.data?.resposta ||
      response.data?.answer ||
      response.data?.mensagem ||
      response.data?.response ||
      'Desculpe, não entendi a resposta.';

    if (response.data?.sessao_id) {
      const newSession = response.data.sessao_id;
      setSessionId(newSession);
      localStorage.setItem('lenior_session_id', newSession);
    }

    setMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
  } catch (error) {
    console.error('🚨 Erro capturado no sendMessage:', error);
    let msg = 'Não foi possível conectar ao servidor. Verifique sua internet.';
    if (error.response) {
      msg = `Erro ${error.response.status}: ${error.response.data?.erro || error.response.statusText}`;
    } else if (error.request) {
      msg = 'Servidor não respondeu. Verifique se a API está no ar.';
    }
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};
