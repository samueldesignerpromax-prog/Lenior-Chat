import axios from 'axios';

// Usa variável de ambiente ou fallback
export const API_URL = import.meta.env.VITE_API_URL || 'https://api-lenior.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor para log (útil para debug)
api.interceptors.request.use((config) => {
  console.log(`🚀 [${config.method.toUpperCase()}] ${config.baseURL}${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ Erro:`, error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
