import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/react_practice_sulyma/',
  plugins: [react()],
});
