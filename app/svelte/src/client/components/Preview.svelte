<script>
  import {setRender} from './context';

  export let Stories;
  export let selectedKind;
  export let selectedStory;

  const render = { selectedKind, selectedStory };

  setRender(render);
</script>

<svelte:component this={Stories} />
