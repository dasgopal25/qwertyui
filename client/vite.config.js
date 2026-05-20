import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': { target: 'https://client1-0epa.onrender.com', changeOrigin: true } }
  }
});
