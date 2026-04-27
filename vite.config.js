import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const isStaticBuild = process.env.BUILD_MODE === 'static';

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    'import.meta.env.VITE_STATIC_BUILD': JSON.stringify(isStaticBuild ? 'true' : 'false'),
  },
  build: {
    minify: false,
  },
});
