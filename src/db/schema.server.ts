import { text, integer, sqliteTable, type AnySQLiteColumn } from 'drizzle-orm/sqlite-core';

export const todoTable = sqliteTable('todos', {
  id: text('id').primaryKey().unique().notNull(),
  parentId: text('parentId').references((): AnySQLiteColumn => todoTable.id, {
    onDelete: 'cascade',
  }),
  status: text('status').notNull(),
  title: text('title'),
  index: integer('index'),
  tags: text('tags'),
});
