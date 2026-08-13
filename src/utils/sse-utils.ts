import { browser } from '$app/environment';
import { IS_STATIC_BUILD } from '../lib/static-mode';

let currentPublishId: string | null = null;
let eventSource: EventSource | null = null;

export const closeSSE = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  currentPublishId = null;
};

export const initSSE = (
  publishId: string | null | undefined,
  callback: (todoString: string) => void
) => {
  if (!browser || IS_STATIC_BUILD) return;

  if (currentPublishId === publishId) {
    return;
  }

  closeSSE();

  if (!publishId) return;

  currentPublishId = publishId;

  try {
    const es = new EventSource(`/api/events?id=${encodeURIComponent(publishId)}`);
    eventSource = es;

    es.addEventListener('todoUpdate', (event: MessageEvent) => {
      if (event.data) {
        callback(event.data);
      }
    });

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) {
        if (eventSource === es) {
          eventSource = null;
          currentPublishId = null;
        }
      }
    };
  } catch (err) {
    console.error('Failed to initialize EventSource:', err);
    closeSSE();
  }
};
