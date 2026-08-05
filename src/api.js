import axios from 'axios';

// URL FIXA (caso o .env não esteja funcionando)
export const API_URL = 'https://lenior-api-com-groq.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

export default api;
