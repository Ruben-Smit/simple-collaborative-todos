import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export const todoTable = sqliteTable('todos', {
  id: text('id').primaryKey().notNull(),
  parentId: text('parentId'),
  status: text('status').notNull().default('unchecked'),
  title: text('title'),
  index: integer('index'),
});

export type TodoRow = InferSelectModel<typeof todoTable>;
export type NewTodoRow = InferInsertModel<typeof todoTable>;
