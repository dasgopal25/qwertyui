import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://server-prrj.onrender.com/api',
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('wc_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;