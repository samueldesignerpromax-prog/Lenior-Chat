import axios from 'axios';

// Tenta usar a variável de ambiente, senão usa a URL fixa
const API_URL = import.meta.env.VITE_API_URL || 'https://api-lenior.onrender.com';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para log detalhado
api.interceptors.request.use((config) => {
  console.log(`📤 [${config.method.toUpperCase()}] ${config.baseURL}${config.url}`, config.data || '');
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Erro completo:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Dados:', error.response.data);
    } else if (error.request) {
      console.error('Requisição feita mas sem resposta:', error.request);
    } else {
      console.error('Erro ao configurar requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
