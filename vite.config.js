// anenterprise-lab/frontend/frontend-a129faec840f2542d190aa038be051711b19e5fa/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // ADDED: Vite development server configuration
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API requests to backend
      '/uploads': 'http://localhost:5000', // ADDED: Proxy /uploads requests to backend
    },
  },
})