import { error } from '@sveltejs/kit';
import cycle from 'cycle';
import { getTodoById } from '../../../utils/database-utils.server';
import type { Todo } from '../../../interfaces/Todo';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  let todo: Todo;
  try {
    if (params.id) {
      todo = await getTodoById(params.id);
    }
    if (!todo) error(404, { message: 'To-do not found' });
  } catch (e) {
    console.error(e);
    error(400, { message: 'Could not load to-do' });
  }

  return {
    ...cycle.decycle(todo),
  };
}
