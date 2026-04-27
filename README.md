# Simple collaborative todos

Open the page and start creating to-dos, and share your to-dos with others.

The goal of this project is to create a simple website where you can keep your own todos and share them with others too.

**No authentication/log-in required!**

Normally nothing will be stored on the server, everything will be stored in your browser or your shared link. Only when clicking the globe it will store the to-do online also. Then all changes will be updated live too. Note: everyone with your to-do link can update it.

Feel free to create PR's if you have a nice idea, but please keep this project simple.

I don't want changes/improvements for this project to be hidden away from the public, so please keep your fork public too if you create any.

# How to run as a Docker container

- Install Docker.
- Run `docker compose -f docker-compose.dev.yml up --build` (or `npm run docker:dev` if you have Node installed).
- Go to http://localhost:3000.
- For instructions on how to use the app open the info page with the ⓘ button.

# How to develop

- Install Node and SQLite3.
- Run `npm install`.
- Run `npm start`.

# Build modes

The app can be built two ways:

### Node server (default)

For full functionality including live collaboration, server-side persistence
and SSE updates.

```sh
npm run build      # outputs the @sveltejs/adapter-node bundle to ./build
node build         # run it
```

### Static SPA (for nginx, GitHub Pages, etc.)

For a fully static bundle that can be hosted from any plain web server. The
`/share/<encoded>` links and local-storage archive still work; live
collaboration (`/collaborate/*`, `/api/*` and SSE) is gracefully disabled
because there is no server to back it.

```sh
npm run build:static
# Output is written to ./build — point nginx (or any static host) at it.
```

A minimal nginx server block:

```nginx
server {
  listen 80;
  root /var/www/simple-collaborative-todos/build;
  location / {
    try_files $uri $uri/ /index.html;   # SPA fallback
  }
}
```

# Future improvements in no particular order

- ~Ability to edit to-dos~
- ~Ability to remove to-dos~
- Touch controls
- ~Create server-less static "mode" to host this in Github pages, but that still works with shared links~
- ~Keep to-dos in local storage and add ability to go through archive~
- ~Create an archive button to "throw away" all to-dos currently in view and to start with a clean slate~
- Create import and export button
- ~Add live collaboration and database persistence (+ change readme to reflect this)~
- ~Add tags to to-dos~
