import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/roll': 'http://localhost:3000',
      '/wallet': 'http://localhost:3000',
      "/images":"http://localhost:3000",
    }
  }
})
