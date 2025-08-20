import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto' : 'repeat(auto-fill, minmax(200px, 1fr))'
      },

      spacing: {
        'section-height' : '500px'
      }
    },
  }

})
