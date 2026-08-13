import cloudflareAdapter from '@sveltejs/adapter-cloudflare';
import nodeAdapter from '@sveltejs/adapter-node';
import staticAdapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const buildMode = process.env.BUILD_MODE ?? 'cloudflare';
const isStaticBuild = buildMode === 'static';
const isCloudflare = buildMode === 'cloudflare';

const getAdapter = () => {
  if (buildMode === 'static') {
    return staticAdapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false,
      strict: false,
    });
  }
  if (buildMode === 'node') {
    return nodeAdapter();
  }
  return cloudflareAdapter();
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: getAdapter(),
    alias: {
      $db_driver: isCloudflare ? 'src/db/drivers/cloudflare.ts' : 'src/db/drivers/node.ts',
    },
    paths: {
      base: isStaticBuild ? (process.env.BASE_PATH ?? '') : '',
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
