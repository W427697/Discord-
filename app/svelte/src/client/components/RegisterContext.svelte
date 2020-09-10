<script>
  import { setRegister } from './context';
  export let Stories;
  export let register;
  setRegister(register);
</script>

<svelte:component this={Stories} />
