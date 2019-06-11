<script>
  import { setContext } from 'svelte';

  import { CTX_RENDER } from '../constants';

  export let Stories;
  export let selectedKind;
  export let selectedStory;

  const render = { selectedKind, selectedStory };

  setContext(CTX_RENDER, render);
</script>

<svelte:component this={Stories} />
