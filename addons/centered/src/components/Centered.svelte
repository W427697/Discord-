<div class="svelte-centered-wrapper" style="{style}">
  <div class="svelte-centered-container" style="{innerStyle}">
    <slot>
      <svelte:component this={Child} />
    </slot>
  </div>
</div>

<script>
  export let style;
  export let innerStyle;
  export let Child = null;
</script>
