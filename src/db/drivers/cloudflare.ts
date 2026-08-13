import { drizzle } from 'drizzle-orm/d1';
import { sql } from 'drizzle-orm';
import * as schema from '../schema.server';

const _d1DbMap = new WeakMap<object, any>();
const _d1InitSet = new WeakSet<object>();

export const getDb = (platform?: App.Platform) => {
  if (platform?.env?.DB) {
    const d1 = platform.env.DB;
    const db = drizzle(d1, { schema });

    if (!_d1InitSet.has(d1)) {
      _d1InitSet.add(d1);
      db.run(
        sql`
        CREATE TABLE IF NOT EXISTS ${schema.todoTable} (
          id TEXT PRIMARY KEY NOT NULL,
          parentId TEXT,
          status TEXT NOT NULL DEFAULT 'unchecked',
          title TEXT,
          "index" INTEGER
        )
      `
      ).catch((err) => {
        console.warn('D1 table creation notice:', err);
      });
    }

    if (_d1DbMap.has(d1)) {
      return _d1DbMap.get(d1);
    }
    _d1DbMap.set(d1, db);
    return db;
  }

  // In case platform is not available (e.g. static analysis pass or mock)
  console.warn('Cloudflare platform.env.DB is not present');
  return {
    select: () => ({ from: () => ({ where: () => ({ orderBy: () => [] }) }) }),
    insert: () => ({ values: () => ({ onConflictDoUpdate: () => [] }) }),
    delete: () => ({ where: () => {} }),
  };
};
