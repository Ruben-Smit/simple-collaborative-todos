# Simple Collaborative Todos

Open the page and start creating to-dos, and share your to-dos with others.

The goal of this project is to create a simple website where you can keep your own todos and share them with others too.

**No authentication/log-in required!**

Normally nothing will be stored on the server; everything will be stored in your browser or your shared link (`/share/<encoded>`). Only when clicking the globe icon will it store the to-do online and generate a `/collaborate/<id>` link with live multi-user real-time updates.

---

## Deployment & Hosting

### 1. Cloudflare Workers (Default)

Built using `@sveltejs/adapter-cloudflare` and Cloudflare D1 database:

```sh
npm run build:cloudflare   # outputs worker bundle to .svelte-kit/cloudflare
npx wrangler deploy       # deploys to Cloudflare
```

### 2. Docker Containers (SSR and Static on GHCR)

Prebuilt container images are automatically published to GitHub Container Registry (`ghcr.io`):

- **SSR Node Server**:

  ```sh
  docker run -p 3000:3000 -v $(pwd)/data:/data ghcr.io/<owner>/simple-collaborative-todos:latest
  ```

  Or locally: `npm run docker:dev`

- **Static Nginx SPA**:
  ```sh
  docker run -p 80:80 ghcr.io/<owner>/simple-collaborative-todos:static
  ```

### 3. Static SPA (GitHub Pages, Nginx, Netlify, etc.)

For a standalone static client-only app with zero backend required:

```sh
npm run build:static
# Output is written to ./build
```

A minimal Nginx configuration:

```nginx
server {
  listen 80;
  root /var/www/simple-collaborative-todos/build;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## Local Development

1. Install Node.js (v20+ or v22 LTS recommended).
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start development server:
   ```sh
   npm run dev
   ```
4. Open http://localhost:5173.

---

## Available Scripts

- `npm run dev`: Start local development server.
- `npm run build`: Build for Cloudflare Workers.
- `npm run build:cloudflare`: Build for Cloudflare Workers.
- `npm run build:node`: Build for Node.js / Docker SSR.
- `npm run build:static`: Build standalone static SPA.
- `npm run check`: Run Svelte and TypeScript diagnostics.
- `npm run lint`: Check code formatting with Prettier.
- `npm run format`: Format codebase with Prettier.
- `npm run docker:dev`: Launch local dev environment in Docker.

# Future improvements in no particular order

- ~~Ability to edit to-dos~~
- ~~Ability to remove to-dos~~
- Touch controls
- ~~Create server-less static "mode" to host this in Github pages, but that still works with shared links~~
- ~~Keep to-dos in local storage and add ability to go through archive~~
- ~~Create an archive button to "throw away" all to-dos currently in view and to start with a clean slate~~
- Create import and export button
- ~~Add live collaboration and database persistence (+ change readme to reflect this)~~
- ~~Add tags to to-dos~~
