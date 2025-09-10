import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: '.',
  base: '/',
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    },
    watch: {
      ignored: ['app/*', '.venv/*', '__pycache__/*', '*.pyc']
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  optimizeDeps: {
    exclude: ['app/*', '.venv/*', '*.py'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-toast',
      '@radix-ui/react-slot',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-tabs',
      'clsx',
      'lucide-react',
      'class-variance-authority',
      'tailwind-merge'
    ]
  }
});
