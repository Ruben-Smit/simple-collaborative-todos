import type { Todo } from '../interfaces/Todo';

type Subscriber = (todo: Todo) => void;

// Map of todoId -> Set of subscriber callbacks
const subscribersByTodoId = new Map<string, Set<Subscriber>>();

export const sendToClients = (todo: Todo) => {
  if (!todo || !todo.id) return;
  const todoSubscribers = subscribersByTodoId.get(todo.id);
  if (!todoSubscribers || todoSubscribers.size === 0) return;

  for (const subscriber of todoSubscribers) {
    try {
      subscriber(todo);
    } catch (e) {
      console.error('SSE subscriber error:', e);
    }
  }
};

export const subscribeToUpdates = (todoId: string, callback: Subscriber): (() => void) => {
  if (!todoId) return () => {};

  let subscribers = subscribersByTodoId.get(todoId);
  if (!subscribers) {
    subscribers = new Set<Subscriber>();
    subscribersByTodoId.set(todoId, subscribers);
  }

  subscribers.add(callback);

  return () => {
    const subs = subscribersByTodoId.get(todoId);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) {
        subscribersByTodoId.delete(todoId);
      }
    }
  };
};

export const getSubscriberCount = (todoId?: string) => {
  if (todoId) {
    return subscribersByTodoId.get(todoId)?.size ?? 0;
  }
  let total = 0;
  for (const subs of subscribersByTodoId.values()) {
    total += subs.size;
  }
  return total;
};
