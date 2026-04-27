import path from 'path';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

let _db: BetterSQLite3Database | null = null;

const open = (): BetterSQLite3Database => {
  const dbPath = path.resolve(
    process.env.NODE_ENV === 'production' ? '/data/sqlite.db' : 'data/sqlite.dev.db'
  );
  const sqlite = new Database(dbPath);
  return drizzle(sqlite);
};

// Lazy proxy: defer opening the SQLite file until the first query so that
// `vite build`/SvelteKit's analyse pass can import this module without needing
// the database file (or directory) to exist on disk.
export const db: BetterSQLite3Database = new Proxy({} as BetterSQLite3Database, {
  get(_target, prop, receiver) {
    if (!_db) _db = open();
    const value = Reflect.get(_db as object, prop, receiver);
    return typeof value === 'function' ? value.bind(_db) : value;
  },
});
