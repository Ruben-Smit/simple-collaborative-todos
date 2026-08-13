import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildMode = process.env.BUILD_MODE ?? 'cloudflare';
const isStaticBuild = buildMode === 'static';
const isCloudflare = buildMode === 'cloudflare';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $db_driver: path.resolve(
        __dirname,
        isCloudflare ? 'src/db/drivers/cloudflare.ts' : 'src/db/drivers/node.ts'
      ),
    },
  },
  define: {
    'import.meta.env.VITE_STATIC_BUILD': JSON.stringify(isStaticBuild ? 'true' : 'false'),
  },
  build: {
    minify: false,
  },
});
