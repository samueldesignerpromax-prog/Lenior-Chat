import axios from 'axios';

// Usa a variável de ambiente definida no .env
export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para logar requisições
api.interceptors.request.use((config) => {
  console.log(`[${config.method.toUpperCase()}] ${config.url}`, config.data || '');
  return config;
});

// Interceptor para logar respostas
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
