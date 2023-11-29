<script>
  import { onMount } from 'svelte';

  export let decorator = undefined;
  export let Component;
  export let props = {};
</script>

{#if decorator}
  <svelte:component this={decorator.Component} {...decorator.props}>
    <svelte:component this={Component} {...props} />
  </svelte:component>
{:else}
  <svelte:component this={Component} {...props} />
{/if}
