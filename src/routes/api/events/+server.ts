import cycle from 'cycle';
import { subscribeToUpdates } from '../../../utils/sse-utils.server';

/** @type {import('./$types').RequestHandler} */
export function GET({ request, url }) {
  const todoId = url.searchParams.get('id') || request.headers.get('todo-id');

  if (!todoId) {
    return new Response('Missing todo id', { status: 400 });
  }

  const signal = request.signal;
  let unsubscribe: (() => void) | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (event: string, data: any) => {
        try {
          const payload = typeof data === 'string' ? data : JSON.stringify(data);
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${payload}\n\n`));
        } catch {
          cleanup();
        }
      };

      const cleanup = () => {
        if (heartbeatTimer) {
          clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
        try {
          controller.close();
        } catch {}
      };

      // Register subscriber for this todo ID
      unsubscribe = subscribeToUpdates(todoId, (todo) => {
        sendEvent('todoUpdate', cycle.decycle(todo));
      });

      // Send initial connected event
      sendEvent('connected', { todoId });

      // Keepalive heartbeat ping every 15 seconds
      heartbeatTimer = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch {
          cleanup();
        }
      }, 15000);

      // Handle client disconnect / abort signal
      signal.addEventListener('abort', cleanup, { once: true });
    },
    cancel() {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

/** @type {import('./$types').RequestHandler} */
export function POST(event) {
  return GET(event);
}
