import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'


const pathSrc = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "~/": `${pathSrc}/`,
    }
  },
  server: {
    host: "localhost",
    port: 8889,
    proxy: {
      '/api': {
        target: 'http://localhost:8999',
        timeout: 60000,
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    hmr: true
  },
})