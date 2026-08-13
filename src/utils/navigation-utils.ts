import { base } from '$app/paths';
import { Todo } from '../interfaces/Todo';
import { serializeTodo } from '../stores/todo';
import { IS_STATIC_BUILD } from '../lib/static-mode';

const generateUrl = (todo: Todo) => {
  return `${location.origin}${base}/share/${encodeURIComponent(btoa(serializeTodo(todo)))}`;
};

export const shareLink = (todo: Todo) => {
  // In static mode there is no backend, so always use a self-contained base64 URL
  // that encodes the full todo tree and reopens at the same node.
  if (!IS_STATIC_BUILD && todo.publishId) return shareCollaborateLink(todo.id);
  const url = generateUrl(todo);
  const shareObject = {
    title: 'Copy of my to-do list',
    url,
  };
  navigator.canShare(shareObject)
    ? navigator.share(shareObject)
    : navigator.clipboard.writeText(url);
};

const shareCollaborateLink = (todoId: string) => {
  const url = `${window.location.origin}${base}/collaborate/${todoId}`;
  const shareObject = {
    title: 'Collaborate on my to-do list',
    url,
  };
  process.env.NODE_ENV === 'production' && navigator.canShare(shareObject)
    ? navigator.share(shareObject)
    : navigator.clipboard.writeText(url);
};
