import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    allowedHosts: ['emorecweb.onrender.com'], // ✅ Add this line
    proxy: {
      '/api': 'http://localhost:5000'
    },
    historyApiFallback: true
  }
})
