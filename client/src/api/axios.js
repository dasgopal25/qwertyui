import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "/api"
      : "https://qwertyui-qzli.vercel.app/api",
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('wc_token');

  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }

  return cfg;
});

export default api;