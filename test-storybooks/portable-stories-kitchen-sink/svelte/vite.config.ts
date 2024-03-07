import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

console.log("READING VITE CONFIG")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
})
