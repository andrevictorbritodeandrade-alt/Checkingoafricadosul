import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.REACT_APP_GEMINI_API_KEY || ""),
      // Polyfill process.env for libraries that might expect it
      // We ensure we don't stringify undefined values as the string "undefined"
      'process.env': JSON.stringify(env)
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    optimizeDeps: {
      include: ['@google/genai']
    }
  };
});