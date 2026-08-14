import axios from 'axios';

export const API_URL = 'https://lenior-api-com-groq-1.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`🚀 [${config.method.toUpperCase()}] ${config.url}`, config.data || '');
    return config;
  },
  (error) => Promise.reject(error)
);

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
