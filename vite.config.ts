import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Quan trọng: Đảm bảo đường dẫn tài nguyên đúng khi deploy lên sub-folder GitHub Pages
})