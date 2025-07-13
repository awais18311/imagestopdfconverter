import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/images_to_pdf_converter/', 
  plugins: [react()],
})
