import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // redirect any request from /roll or /wallet to your backend
      '/roll': 'http://localhost:3000',
      '/wallet': 'http://localhost:3000',
    }
  }
})
