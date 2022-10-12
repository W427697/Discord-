import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // TODO: remove classic jsxRuntime once we upgrade to React 18
  plugins: [react({ jsxRuntime: 'classic' })],
});
