import { base } from '$app/paths';
import { Todo } from '../interfaces/Todo';
import { serializeTodo } from '../stores/todo';

const generateUrl = (todo: Todo) => {
  return `${location.origin}${base}/share/${encodeURIComponent(btoa(serializeTodo(todo)))}`;
};

export const shareLink = (todo: Todo) => {
  if (todo.publishId) return shareCollaborateLink(todo.id);
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
