import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
   '/hr': 'http://localhost:3000',
    strictPort: true
  },
})
