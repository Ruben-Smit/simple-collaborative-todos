// True when the app was built with `BUILD_MODE=static` (e.g. `npm run build:static`).
// In that mode the SvelteKit server (database, SSE, /api/* routes, /collaborate)
// is not available and the app runs as a pure SPA suitable for hosting on
// nginx, GitHub Pages, etc.
export const IS_STATIC_BUILD: boolean = import.meta.env.VITE_STATIC_BUILD === 'true';
