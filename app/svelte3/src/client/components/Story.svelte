<script>
  import { getContext } from 'svelte';
  import { CTX_STORIES, CTX_REGISTER, CTX_RENDER } from '../constants';

  export let name;
  export let parameters;

  if (!name) {
    throw new Error('Missing Story name');
  }

  const render = getContext(CTX_RENDER);
  const renderThis = render && render.selectedStory === name;

  const register = getContext(CTX_REGISTER);
  if (register) {
    const stories = getContext(CTX_STORIES);
    stories.add(name, (...args) => register.storyFn(...args), parameters);
  }
</script>

{#if renderThis}
  <slot />
{/if}
