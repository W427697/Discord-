<script>
  import { beforeUpdate } from 'svelte';

  import { setRender, setRegister, setArgs } from './context';
  export let args;
  export let Stories;
  export let selectedKind;
  export let selectedStory;
  const render = { selectedKind, selectedStory };
  setRegister(null);
  setRender(render);
  setArgs(args);
</script>

<svelte:component this={Stories} />
