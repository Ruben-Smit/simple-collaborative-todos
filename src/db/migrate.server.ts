import path from 'path';
import fs from 'fs';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './init.server';

// Skip migrations during the build-time analysis pass when the data
// directory doesn't exist yet (e.g. building on a fresh CI machine or
// inside a multi-stage Dockerfile before /data is mounted).
const dbDir = path.resolve(
  process.env.NODE_ENV === 'production' ? '/data' : 'data'
);

if (fs.existsSync(dbDir)) {
  try {
    migrate(db, { migrationsFolder: 'migrations' });
  } catch (e) {
    console.error('Database migration failed:', e);
  }
} else {
  console.warn(`Skipping migrations: data directory ${dbDir} does not exist yet.`);
}
