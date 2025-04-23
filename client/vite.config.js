import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    proxy: {
      // Forward all /api requests to your backend server
      '/api': {
        target: 'http://localhost:3000', // Change to your backend URL
        changeOrigin: true,
        secure: false,
      }
    },
  }
})
