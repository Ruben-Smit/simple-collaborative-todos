<script>
  import StyledButton from '../../components/StyledButton.svelte';
  import StyledVectorGraphic from '../../components/StyledVectorGraphic.svelte';
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center gap-2">
    <a href="/">
      <StyledButton
        ><StyledVectorGraphic>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </StyledVectorGraphic>
      </StyledButton>
    </a>
    Back to homepage
  </div>
  <div class="flex items-center gap-2">
    <a href="https://github.com/Rerbun/simple-collaborative-todos" target="_blank">
      <StyledButton>
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 fill-gray-500 dark:fill-gray-300"
          ><title>GitHub</title><path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
          /></svg
        >
      </StyledButton>
    </a>
    This project's GitHub
  </div>
  <hr />
  <h1 class="font-bold">Button instructions</h1>
  <div class="flex items-center gap-2">
    <StyledButton name="remove"
      ><StyledVectorGraphic>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
        />
      </StyledVectorGraphic>
    </StyledButton>
    Remove the to-do or list
  </div>
  <div class="flex items-center gap-2">
    <StyledButton name="next"
      ><StyledVectorGraphic>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
        />
      </StyledVectorGraphic>
    </StyledButton>
    Open next entry in archive
  </div>
  <div class="flex items-center gap-2">
    <StyledButton name="previous"
      ><StyledVectorGraphic>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
        />
      </StyledVectorGraphic>
    </StyledButton>
    Open previous entry in archive
  </div>
  <div class="flex items-center gap-2">
    <StyledButton name="add-todo"
      ><StyledVectorGraphic>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </StyledVectorGraphic>
    </StyledButton>
    Add new to-do or to-do list
  </div>
  <div class="flex items-center gap-2">
    <StyledButton name="view"
      ><StyledVectorGraphic>
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
    </StyledButton>
    Open child to-do
  </div>
  <div class="flex items-center gap-2">
    <StyledButton name="open-parent"
      ><StyledVectorGraphic>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
        />
      </StyledVectorGraphic>
    </StyledButton>
    Go to parent to-do
  </div>
  <div class="flex items-center gap-2">
    <StyledButton name="edit">
      <StyledVectorGraphic>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
        />
      </StyledVectorGraphic>
    </StyledButton>
    Activate edit mode, in this mode you can edit the to-dos or change the order
  </div>
  <div class="flex items-center gap-2">
    <StyledButton name="edit">
      <StyledVectorGraphic>
        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </StyledVectorGraphic>
    </StyledButton>
    Save changes done in edit mode
  </div>
  <div class="flex items-center gap-2">
    <StyledButton name="share"
      ><StyledVectorGraphic>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
        />
      </StyledVectorGraphic>
    </StyledButton>
    It compresses the current to-do list into a shareable link, which can be shared with others.
    <br />To share the link it tries to use the browser's built-in sharing functionality, otherwise
    it just copies the link.
  </div>
  <div class="flex items-center gap-2">
    <StyledButton name="publish"
      ><StyledVectorGraphic>
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
        />
      </StyledVectorGraphic>
    </StyledButton>
    Publishes the current to-do list and all descending to-dos/todo-lists, parents will remain local and
    need to be published explicitly.
    <br />To share the published link it tries to use the browser's built-in sharing functionality,
    otherwise it just copies the link.
  </div>
</div>
