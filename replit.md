# Simple collaborative todos

A small SvelteKit + Tailwind app for collaborative to-do lists, backed by SQLite
via Drizzle and live-updated through Server-Sent Events (sveltekit-sse).

## Architecture

- **UI**: Svelte 4 components in `src/components`, routes in `src/routes`.
- **State**: nanostores in `src/stores/todo.ts`. The whole list is also
  serialized to localStorage (`src/utils/storage-utils.ts`).
- **Persistence**: Drizzle ORM + better-sqlite3 (`src/db`). The DB connection is
  lazy (`src/db/init.server.ts`) so that the SvelteKit build/analyse pass does
  not need the database file to exist.
- **Live updates**: `/api/events` streams `todoUpdate` events. Subscribers are
  tracked in a `Set` (`src/utils/sse-utils.server.ts`) and removed via
  sveltekit-sse's `cancel` callback — the previous EventEmitter-based design
  leaked one listener per SSE connection and never cleaned them up.

## Build modes

Switched on `BUILD_MODE`:

- **node** (default) — `npm run build` + `node build`. Full server, DB, SSE.
- **static** — `./scripts/build-static.sh` (or `BUILD_MODE=static npx vite build`).
  Uses `@sveltejs/adapter-static` with `fallback: 'index.html'`. Server-only
  features are gated behind `IS_STATIC_BUILD` (`src/lib/static-mode.ts`,
  populated from the Vite-injected `VITE_STATIC_BUILD` define).

The `/share/<encoded>` route works in both modes (it's a `+page.ts` that
runs on the client), so static-hosted users can still open shared lists.

## Tags

`Todo.tags: string[]` (see `src/interfaces/Todo.ts`). Persisted as a JSON-text
column `tags` on the `todos` table (migration `0001_strange_inhumans.sql`).
TodoList renders existing tags as pills before a tag-shaped "+" button using
flex alignment; the button prompts for a tag, and in edit mode clicking a tag
removes it.

## Workflows

- `Start application` — `npx vite dev --host 0.0.0.0 --port 5000 --strictPort`.

## User preferences

- Branching: user prefers commits on a separate branch when feasible. Currently
  done on `main` per their explicit confirmation.
