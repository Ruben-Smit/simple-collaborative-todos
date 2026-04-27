import type { Todo } from '../interfaces/Todo';

type Subscriber = (todo: Todo) => void;

const subscribers = new Set<Subscriber>();

export const sendToClients = (todo: Todo) => {
  for (const subscriber of subscribers) {
    try {
      subscriber(todo);
    } catch (e) {
      console.error('SSE subscriber error:', e);
    }
  }
};

export const subscribeToUpdates = (callback: Subscriber): (() => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

export const getSubscriberCount = () => subscribers.size;
