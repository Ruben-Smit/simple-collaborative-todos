import nodeAdapter from '@sveltejs/adapter-node';
import staticAdapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const isStaticBuild = process.env.BUILD_MODE === 'static';

const adapter = isStaticBuild
  ? staticAdapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: false,
    })
  : nodeAdapter();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter,
    paths: {
      base: isStaticBuild ? process.env.BASE_PATH ?? '' : '',
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
