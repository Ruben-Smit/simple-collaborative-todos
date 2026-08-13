import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql } from 'drizzle-orm';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import * as schema from '../schema.server';

const createTable = (db: ReturnType<typeof drizzle>) => {
  db.run(sql`
    CREATE TABLE IF NOT EXISTS ${schema.todoTable} (
      id TEXT PRIMARY KEY NOT NULL,
      parentId TEXT,
      status TEXT NOT NULL DEFAULT 'unchecked',
      title TEXT,
      "index" INTEGER
    )
  `);
};

let _nodeDb: ReturnType<typeof drizzle> | null = null;

export const getDb = (_platform?: App.Platform) => {
  if (_nodeDb) return _nodeDb;

  try {
    const dbDir = path.resolve(process.env.NODE_ENV === 'production' ? '/data' : 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const dbPath = path.resolve(
      process.env.NODE_ENV === 'production' ? '/data/sqlite.db' : 'data/sqlite.dev.db'
    );

    const sqlite = new Database(dbPath);
    _nodeDb = drizzle(sqlite, { schema });
    createTable(_nodeDb);
  } catch (err) {
    console.warn('Failed to initialize local SQLite database:', err);
    const sqlite = new Database(':memory:');
    _nodeDb = drizzle(sqlite, { schema });
    createTable(_nodeDb);
  }

  return _nodeDb;
};
