<script>
  import { getRegister, getRender } from './context';
  export let name;
  export let parameters;
  export let decorators; // TODO
  if (!name) {
    throw new Error('Missing Story name');
  }
  const render = getRender();
  const renderThis = render && render.selectedStory === name;
  const register = getRegister();
  if (register) {
    register.addStory({
      name,
      decorators,
      parameters,
    });
  }
</script>

{#if renderThis}
  <slot />
{/if}
