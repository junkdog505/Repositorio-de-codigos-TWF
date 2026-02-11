// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@tailwindcss/vite';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwind()],
    ssr: {
      noExternal: ['gsap']
    }
  },

  integrations: [react()],

  adapter: node({
    mode: 'standalone',
  }),
});