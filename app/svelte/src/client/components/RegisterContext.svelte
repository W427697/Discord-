<script>
  import { setContext } from 'svelte';
  import { setRender, setRegister } from './context';
  export let Stories;
  export let register;
  setRender(null);
  setRegister(register);
</script>

<svelte:component this={Stories} />
