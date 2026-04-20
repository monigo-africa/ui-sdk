import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [svelte({ hot: false })],
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.svelte.ts', 'tests/**/*.test.svelte.ts'],
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    conditions: ['browser', 'module', 'svelte'],
  },
})
