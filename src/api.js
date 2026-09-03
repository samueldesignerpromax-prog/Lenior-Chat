import axios from 'axios';

// Usa a variável de ambiente
export const API_URL = import.meta.env.VITE_API_URL;

// Fallback para teste (caso o .env não carregue)
// export const API_URL = 'https://api-lenior.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
  headers: { 'Content-Type': 'application/json' },
});

// Interceptadores para debug
api.interceptors.request.use((config) => {
  console.log(`[${config.method.toUpperCase()}] ${config.url}`, config.data || '');
  return config;
});

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
