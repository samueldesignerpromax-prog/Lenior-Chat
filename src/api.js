import axios from 'axios';

// Em desenvolvimento, use o proxy do Vite
export const API_URL = '/api';

// Se quiser testar direto, descomente a linha abaixo e comente a de cima
// export const API_URL = 'https://api-lenior.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

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
