<script>
  import { getArgs, getRegister, getRender } from './context';
  export let name;
  export let parameters;
  export let decorators;
  export let argTypes;
  const args = getArgs();
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
      argTypes,
    });
  }
</script>

{#if renderThis}
  <p>argument is now = {JSON.stringify(args)}</p>

  <slot {args}><em>no content was provided</em></slot>
{/if}
