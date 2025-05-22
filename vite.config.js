// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',                      // required by Render
    port: process.env.PORT || 5173,       // allows Render to assign the port
    proxy: {
      '/api': 'http://localhost:5000'     // keeps your API proxy
    }
  }
})
