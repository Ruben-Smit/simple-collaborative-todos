import { error, json } from '@sveltejs/kit';
import cycle from 'cycle';
import { getTodoById } from '../../../../utils/database-utils.server';
import type { Todo } from '../../../../interfaces/Todo';

export async function GET({ params, platform }) {
  let todo: Todo;
  try {
    if (params.id) {
      todo = await getTodoById(params.id, platform);
    }
    if (!todo) error(404, { message: 'To-do not found' });
  } catch (e) {
    console.error(e);
    error(400, { message: 'Could not load to-do' });
  }

  return json(cycle.decycle(todo));
}
