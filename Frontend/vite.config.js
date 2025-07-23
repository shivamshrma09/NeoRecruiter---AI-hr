import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
   '/hr': 'https://neorecruiter-ai-hr.onrender.com',
    strictPort: true
  },
})
