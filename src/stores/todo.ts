import { browser } from '$app/environment';
import { base } from '$app/paths';
import { atom, computed, type ReadableAtom, type WritableAtom } from 'nanostores';
import cycle from 'cycle';
import { Todo } from '../interfaces/Todo';
import { storeTodo } from '../utils/storage-utils';
import { initSSE } from '../utils/sse-utils';
import { IS_STATIC_BUILD } from '../lib/static-mode';

export const serializeTodo = (todo: Todo | Record<string, any>) => {
  return JSON.stringify(cycle.decycle(todo));
};

export const deserializeTodo = (serializedTodo?: string) => {
  return serializedTodo && cycle.retrocycle(JSON.parse(serializedTodo));
};

const serializedTodo: WritableAtom<string> = atom();

const deserializedTodo: ReadableAtom<Todo | undefined> = computed(serializedTodo, deserializeTodo);

const instancedTodo: WritableAtom<Todo | undefined> = atom(null);

export const todoAtom: ReadableAtom<Todo | undefined> = computed(
  [deserializedTodo, instancedTodo],
  (object, instance) => instance || object
);

const onUpdateReceived = (todoString: string) => {
  if (!todoString) return;
  const updatedTodo = deserializeTodo(todoString);
  const currentTodo = instancedTodo.get();
  if (currentTodo && currentTodo.findDescendantById(updatedTodo.id)) {
    updatedTodo.publishId = updatedTodo.id;
    updateTodo(Todo.fromObject(updatedTodo), false);
  }
};

// Re-initialize SSE when the publishId changes (server mode only)
if (!IS_STATIC_BUILD) {
  todoAtom.listen((todo) => initSSE(todo?.publishId, onUpdateReceived));
}

export const updateTodo = async (todo: Todo, publishUpdate: boolean = true) => {
  storeTodo(todo);
  if (!IS_STATIC_BUILD && publishUpdate && todo.publishId && todo.isInstance) {
    await publishTodo(todo.getApicalParent() as Todo);
  }
  viewTodo(todo, publishUpdate);
};

export const viewTodo = async (
  todoObject: Record<string, any> | Todo,
  fetchLatest: boolean = true
) => {
  let todo = todoObject;
  todo =
    !IS_STATIC_BUILD && todoObject.publishId && fetchLatest
      ? (await fetchTodoById(todoObject.publishId))?.findDescendantById(todo.id) ?? todo
      : todo;
  todo = !todo.isInstance ? getInstancedTodo(todo.id) : todo;
  if (todo.isInstance) {
    instancedTodo.set(todo as Todo);
  } else {
    serializedTodo.set(serializeTodo(todo));
  }
  browser && window.history.replaceState(null, '', `${window.location.origin}${base}/`);
};

const getInstancedTodo = (id: string): Todo => {
  const todo = todoAtom.get();
  if (todo?.isInstance) return todo.getApicalParent().findDescendantById(id);
  return null;
};

export const publishTodo = async (todo: Todo): Promise<string> => {
  if (!browser || IS_STATIC_BUILD) return;
  const id = await (
    await fetch('/api/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cycle.decycle(todo)),
    })
  ).text();
  return id;
};

const fetchTodoById = async (id: string): Promise<Todo> => {
  if (!browser || IS_STATIC_BUILD) return;
  const response = await fetch(`/api/todo/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status !== 200) {
    console.error('Failed to fetch todo: ', response);
    return null;
  }
  const todo = Todo.fromObject(cycle.retrocycle(await response.json()));
  todo.publishId = todo.id;
  return todo;
};
