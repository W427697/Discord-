<h1>Button view</h1>

<Button {rounded} on:click={incrementCount}>{text}: {count}</Button>

<p>A little text to show this is a view.</p>

<script>
  /* eslint-disable import/no-mutable-exports */

  import { createEventDispatcher } from 'svelte';

  import Button from '../../components/Button.svelte';

  const dispatch = createEventDispatcher();

  export let rounded = false;
  export let count = 0;
  export let text = 'You clicked';

  export const incrementCount = event => {
    count += 1;
    dispatch('click', event);
  };
</script>
