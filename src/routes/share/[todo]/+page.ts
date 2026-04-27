import { error } from '@sveltejs/kit';
import { deserializeTodo } from '../../../stores/todo';

/** @type {import('./$types').PageLoad} */
export const load = ({ params }) => {
  let todo;
  try {
    let todoString = params.todo;
    if (todoString) {
      todo = deserializeTodo(atob(decodeURIComponent(todoString)));
    }
  } catch (e) {
    console.error(e);
    error(400, { message: 'Incorrect URL' });
  }

  return { todo };
};
