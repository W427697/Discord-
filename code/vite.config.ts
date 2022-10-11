// TODO: install these deps even though they are already installed by other packages, or just silent the eslint error
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
