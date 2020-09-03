<script>
  import { setRender, setRegister } from './context';
  export let Stories;
  export let selectedKind;
  export let selectedStory;
  const render = { selectedKind, selectedStory };
  setRegister(null);
  setRender(render);
</script>

<svelte:component this={Stories} />
