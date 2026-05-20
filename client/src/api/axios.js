import axios from 'axios';

const api = axios.create({ baseURL: 'https://client1-0epa.onrender.com' });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('wc_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
