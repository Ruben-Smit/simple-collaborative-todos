import { source } from 'sveltekit-sse';
import { IS_STATIC_BUILD } from '../lib/static-mode';

let todoId: string = null;
let subscription: ReturnType<typeof source> = null;

export const initSSE = (publishId: string, callback: (todoString: string) => void) => {
  if (IS_STATIC_BUILD) return;
  if (todoId === publishId) {
    return;
  }

  subscription?.close();
  subscription = null;
  todoId = null;

  if (!publishId) return;

  subscription = source('/api/events', {
    options: {
      headers: { 'todo-id': publishId },
      timeout: undefined,
    },
  });

  subscription.select('todoUpdate').subscribe(callback);

  todoId = publishId;
};
