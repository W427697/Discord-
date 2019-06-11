<script>
  import { setContext } from 'svelte';
  import { CTX_REGISTER, CTX_RENDER } from '../constants';

  export let Stories;
  export let register;

  setContext(CTX_REGISTER, register);
</script>

<svelte:component this={Stories} />
