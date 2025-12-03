import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Quan trọng: Sử dụng đường dẫn tương đối để file HTML có thể load JS/CSS 
  // dù được deploy ở domain gốc hay sub-folder (ví dụ: username.github.io/repo-name)
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Tối ưu hóa việc chia nhỏ file để browser cache tốt hơn
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react'],
        },
      },
    },
  },
})