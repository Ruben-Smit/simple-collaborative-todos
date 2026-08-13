import { eq, desc, inArray } from 'drizzle-orm';
import { Todo } from '../interfaces/Todo';
import { todoTable, type TodoRow } from '../db/schema.server';
import { getDb } from '../db/init.server';

export const getTodoById = async (id: string, platform?: App.Platform) => {
  const database = getDb(platform);
  const rows: TodoRow[] = await database.select().from(todoTable).where(eq(todoTable.id, id));
  const todoEntry = rows[0];

  if (!todoEntry) return null;
  const todoObject = {
    ...todoEntry,
    children: await getChildTodos(todoEntry, database),
  };
  return Todo.fromObject(todoObject);
};

const getChildTodos = async (parent: Todo | Record<string, any>, database: any) => {
  const output: Record<string, any>[] = [];
  const childEntries: TodoRow[] = await database
    .select()
    .from(todoTable)
    .where(eq(todoTable.parentId, parent.id))
    .orderBy(todoTable.index);

  if (childEntries.length === 0) return output;

  await Promise.all(
    childEntries.map(async (child, index) => {
      const todoChild: Record<string, any> = { parent, ...child };
      todoChild.children = await getChildTodos(todoChild, database);
      output[index] = todoChild;
    })
  );

  return output;
};

export const saveTodo = async (
  todo: Todo,
  index: number | null = null,
  platform?: App.Platform
) => {
  const database = getDb(platform);
  const { children, parent } = todo;
  const entry = {
    id: todo.id,
    title: todo.title ?? '',
    status: todo.status ?? 'unchecked',
    parentId: parent?.id ?? null,
    index,
  };

  await database.insert(todoTable).values(entry).onConflictDoUpdate({
    target: todoTable.id,
    set: entry,
  });

  await syncDeletedChildren(entry.id, children ?? [], database);

  if (children && children.length > 0) {
    const childPromises = children.map((child, idx) => {
      return saveTodo(child, idx, platform);
    });
    await Promise.all(childPromises);
  }
};

const syncDeletedChildren = async (parentId: string, children: Todo[], database: any) => {
  const currentChildren: TodoRow[] = await database
    .select()
    .from(todoTable)
    .where(eq(todoTable.parentId, parentId))
    .orderBy(desc(todoTable.index));

  const childrenToDelete = currentChildren.filter(
    (child) => !children.some((newChild) => newChild.id === child.id)
  );

  if (childrenToDelete.length > 0) {
    await database.delete(todoTable).where(
      inArray(
        todoTable.id,
        childrenToDelete.map(({ id }) => id)
      )
    );
  }
};
