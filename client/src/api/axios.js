import axios from 'axios';

const api = axios.create({ baseURL: 'https://server-prrj.onrender.com' });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('wc_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
