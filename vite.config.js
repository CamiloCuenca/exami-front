import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  define: {
    // Definir las variables de entorno para que estén disponibles en el código del cliente
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV || 'development'),
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:8080/api'),
  }
})