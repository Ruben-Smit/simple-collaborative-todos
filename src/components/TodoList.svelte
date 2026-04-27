<script lang="ts">
  import { Todo } from '../interfaces/Todo';
  import { todoAtom as computedTodo, publishTodo, updateTodo, viewTodo } from '../stores/todo';
  import { shareLink } from '../utils/navigation-utils';
  import { IS_STATIC_BUILD } from '../lib/static-mode';
  import StyledButton from './StyledButton.svelte';
  import StyledVectorGraphic from './StyledVectorGraphic.svelte';

  let todo: Todo = new Todo();

  let editMode: boolean = false;

  computedTodo.subscribe((value) => {
    if (value) todo = Todo.fromObject(value);
  });

  const handleCheck = (event: Event, touchedTodo: Record<string, any>) => {
    touchedTodo.status = (event.target as HTMLInputElement).checked ? 'checked' : 'unchecked';
    updateTodo(Todo.fromObject(todo));
  };

  const handleChildSubmit = (event, parent: Record<string, any> = todo) => {
    const parentTodo = Todo.fromObject(parent);
    const newTodo = new Todo(
      (new FormData(event.target).get('new-todo') as string) ?? '',
      parentTodo
    );
    if (parentTodo.publishId) newTodo.publishId = parentTodo.publishId;

    parentTodo.children.push(newTodo);
    updateTodo(parentTodo);

    event.target.reset();
  };

  const handleChildRemoveByIndex = (index: number) => {
    todo.children.splice(index, 1);
    updateTodo(Todo.fromObject(todo));
  };

  const handleEditModeToggle = () => {
    editMode && updateTodo(Todo.fromObject(todo));
    editMode = !editMode;
  };

  const sortTodo = (sortedTodo: Todo, direction: 'up' | 'down', currentIndex: number) => {
    const modifier = direction === 'up' ? -1 : 1;
    const swapIndex = currentIndex + modifier;
    todo.children[currentIndex] = todo.children[swapIndex];
    todo.children[swapIndex] = sortedTodo;
    updateTodo(Todo.fromObject(todo));
  };

  const handleContentEditCompleted = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      (event.target as HTMLElement).blur();
    }
  };

  const handleViewTodo = (todoObject: Record<string, any>) => {
    if (todoObject.parent && todoObject.parent?.id === todo.id) {
      todoObject.parent = todo;
    }
    viewTodo(todoObject);
  };

  const publish = async (todoObject: Record<string, any>) => {
    const todo = Todo.fromObject(todoObject);
    const id = await publishTodo(todo);

    if (id) {
      todo.publishId = id;
      updateTodo(todo, false);
    }
  };

  const handleAddTag = (child: Record<string, any>) => {
    const raw = typeof window !== 'undefined' ? window.prompt('Add a tag') : null;
    if (raw === null) return;
    const value = raw.trim();
    if (!value) return;
    const existing = Array.isArray(child.tags) ? child.tags : [];
    if (existing.includes(value)) return;
    child.tags = [...existing, value];
    updateTodo(Todo.fromObject(todo));
  };

  const handleRemoveTag = (child: Record<string, any>, tag: string) => {
    child.tags = (child.tags ?? []).filter((t: string) => t !== tag);
    updateTodo(Todo.fromObject(todo));
  };
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center gap-2">
    <StyledButton name="edit" on:click={handleEditModeToggle}
      ><StyledVectorGraphic>
        {#if !editMode}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
          />
        {:else}
          <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        {/if}
      </StyledVectorGraphic>
    </StyledButton>
    {#if !editMode}
      <StyledButton name="share" on:click={() => shareLink(Todo.fromObject(todo))}
        ><StyledVectorGraphic>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
          />
        </StyledVectorGraphic>
      </StyledButton>
      {#if !IS_STATIC_BUILD}
        {#if !todo.publishId}
          <StyledButton name="publish" on:click={() => publish(Todo.fromObject(todo))}
            ><StyledVectorGraphic>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
              />
            </StyledVectorGraphic>
          </StyledButton>
        {:else}
          <StyledVectorGraphic>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
            />
          </StyledVectorGraphic>
        {/if}
      {/if}
    {/if}
    {#if todo.parent}
      <StyledButton name="open-parent" on:click={() => todo.parent && handleViewTodo(todo.parent)}
        ><StyledVectorGraphic>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
          />
        </StyledVectorGraphic>
      </StyledButton>
    {/if}
    {#if editMode}
      <StyledVectorGraphic
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
        /></StyledVectorGraphic
      >
      <h1
        contenteditable="true"
        class="px-2 py-1 text-xl font-medium border border-gray-400 rounded dark:border-gray-500"
        bind:textContent={todo.title}
        on:keydown={handleContentEditCompleted}
      >
        {todo.title}
      </h1>
    {:else if todo.title}
      <h1 class="text-xl font-medium">{todo.title}</h1>
    {/if}
  </div>

  {#each todo.children as child, index}
    <div
      class="flex items-center justify-between w-full gap-1 py-1 pl-2 pr-1 border rounded hover:border-gray-400 dark:border-gray-500 dark:hover:border-gray-400"
    >
      <div class="flex items-center gap-2">
        {#if !editMode}
          <input
            type="checkbox"
            name="checkbox-{index}"
            id="checkbox-{index}"
            checked={child.status === 'checked'}
            class="leading-tight text-white bg-white border border-gray-200 rounded shadow focus:ring-transparent focus:ring-offset-0 checked:text-white checked:bg-white focus:checked:bg-white focus:checked:text-white hover:border-gray-400 focus:border-gray-400 focus:checked:border-gray-400 checked:border-gray-400 dark:bg-neutral-700 dark:border-neutral-500 dark:focus:border-neutral-500 dark:checked:text-neutral-700 dark:checked:bg-neutral-700 dark:checked:border-neutral-500 dark:focus:checked:bg-neutral-700 dark:focus:checked:border-neutral-500 size-8"
            on:change={(event) => handleCheck(event, child)}
          />
          <label for="checkbox-{index}">{child.title}</label>
        {:else}
          <StyledVectorGraphic
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            /></StyledVectorGraphic
          >
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            contenteditable="true"
            class="px-2 py-1 border border-gray-400 rounded dark:border-gray-500"
            bind:textContent={child.title}
            on:keydown={handleContentEditCompleted}
          >
            {child.title}
          </div>
        {/if}
      </div>
      <div class="flex items-center gap-1">
        <div class="flex items-center flex-wrap gap-1">
          {#each child.tags ?? [] as tag (tag)}
            <button
              type="button"
              title={editMode ? `Remove tag "${tag}"` : tag}
              on:click={() => editMode && handleRemoveTag(child, tag)}
              class="inline-flex items-center h-6 pl-2 pr-2 text-xs leading-none rounded-full border border-gray-300 text-gray-600 bg-gray-50 hover:border-gray-400 dark:border-neutral-500 dark:text-gray-300 dark:bg-neutral-700 dark:hover:border-gray-400 {editMode
                ? 'cursor-pointer'
                : 'cursor-default'}"
            >
              {tag}
            </button>
          {/each}
          <button
            type="button"
            name="add-tag"
            aria-label="Add tag"
            title="Add tag"
            on:click={() => handleAddTag(child)}
            class="inline-flex items-center justify-center w-8 h-6 rounded-r-full rounded-l-sm border border-gray-300 bg-white text-gray-500 hover:border-gray-400 focus:outline-none dark:bg-neutral-700 dark:border-neutral-500 dark:text-gray-300 dark:hover:border-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 10h4M12 8v4"
              />
            </svg>
          </button>
        </div>
        {#if !editMode}
          <StyledButton
            name="view"
            on:click={() => {
              handleViewTodo(child);
            }}
          >
            {#if !child.children.length}
              <StyledVectorGraphic>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </StyledVectorGraphic>
            {:else}
              <span
                >{child.children.reduce(
                  (numberOfCompleted, child) =>
                    numberOfCompleted + Number(child.status !== 'unchecked'),
                  0
                )}/{child.children.length}</span
              >
            {/if}
          </StyledButton>
        {:else}
          {#if index !== 0}
            <StyledButton
              name="move-up"
              on:click={() => {
                sortTodo(child, 'up', index);
              }}
            >
              <StyledVectorGraphic>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                />
              </StyledVectorGraphic>
            </StyledButton>
          {/if}
          {#if index !== todo.children.length - 1}
            <StyledButton
              name="move-down"
              on:click={() => {
                sortTodo(child, 'down', index);
              }}
            >
              <StyledVectorGraphic>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                />
              </StyledVectorGraphic>
            </StyledButton>
          {/if}
        {/if}
        <StyledButton
          name="remove"
          on:click={() => {
            handleChildRemoveByIndex(index);
          }}
          ><StyledVectorGraphic>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </StyledVectorGraphic>
        </StyledButton>
      </div>
    </div>
  {/each}
  {#if !editMode}
    <form on:submit|preventDefault={(event) => handleChildSubmit(event)} class="flex gap-1">
      <input
        type="text"
        name="new-todo"
        placeholder="New to-do"
        class="w-full h-10 px-2 py-2 mb-3 leading-tight text-gray-700 border border-gray-200 rounded shadow appearance-none focus:ring-transparent focus:ring-offset-0 hover:border-gray-400 focus:border-gray-400 focus:outline-none focus:shadow-outline dark:bg-neutral-800 dark:border-neutral-500 dark:focus:border-neutral-500 dark:text-gray-200 dark:placeholder:text-gray-400"
      />
      <StyledButton type="submit" name="add-todo"
        ><StyledVectorGraphic>
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </StyledVectorGraphic>
      </StyledButton>
    </form>
  {/if}
</div>
