<script>
  /* eslint-disable import/no-mutable-exports */

  import { createEventDispatcher } from 'svelte';

  export let rounded = false;
  export let count = 0;
  export let text = '';

  const dispatch = createEventDispatcher();

  const onClick = event => {
    rounded = !rounded;
    dispatch('click', event);
  };
</script>

<style>
  .rounded {
    border-radius: 35px;
  }

  .button {
    border: 3px solid;
    padding: 10px 20px;
    background-color: white;
    outline: none;
  }
</style>

<button
  class="button"
  class:rounded
  on:click={onClick}>
  <strong>{rounded ? 'Round' : 'Square'} corners</strong><br>
  {text}
  <slot />
</button>
