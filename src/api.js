import axios from 'axios';

// URL absoluta da API – SEM barra no final
export const API_URL = 'https://api-lenior.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptadores para debug
api.interceptors.request.use((config) => {
  console.log(`[${config.method.toUpperCase()}] ${config.baseURL}${config.url}`, config.data || '');
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ [${response.status}] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Erro completo:', error);
    console.error('Status:', error.response?.status);
    console.error('Dados:', error.response?.data);
    console.error('Config:', error.config);
    return Promise.reject(error);
  }
);

export default api;
