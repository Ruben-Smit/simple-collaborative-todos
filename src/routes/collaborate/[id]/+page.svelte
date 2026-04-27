<script lang="ts">
  import { Todo } from '../../../interfaces/Todo';
  import { updateTodo } from '../../../stores/todo';
  import { IS_STATIC_BUILD } from '../../../lib/static-mode';

  /** @type {import('./$types').PageData} */
  export let data;

  let todo: Todo;
  if (!IS_STATIC_BUILD && data) {
    todo ??= Todo.fromObject(data ?? new Todo());
    if (todo) {
      todo.publishId = todo.id;
      updateTodo(todo, false);
    }
  }
</script>

{#if IS_STATIC_BUILD}
  <p class="py-8 text-center">
    Live collaboration isn't available in this static build of the app.
  </p>
{/if}
