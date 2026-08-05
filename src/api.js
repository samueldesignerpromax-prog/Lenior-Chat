import axios from 'axios';

// URL da API (do .env ou fallback)
export const API_URL = import.meta.env.VITE_API_URL || 'https://lenior-api-com-groq-1.onrender.com';

// Criação da instância Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos (para buscas na web)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para log de requisições (opcional, mas útil para debug)
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 [${config.method.toUpperCase()}] ${config.url}`, config.data || '');
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para log de respostas
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ Erro na requisição:`, error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
