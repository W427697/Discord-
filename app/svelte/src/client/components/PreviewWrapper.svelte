<script>
  export let story;
  export let wrappers;
  // --- wrappers ---
  const resolveWrapper = (wrapper) => {
    if (!wrapper) {
      return null;
    } else if (typeof wrapper === 'function') {
      return { Component: wrapper };
    } else if (wrapper.Component) {
      return wrapper;
    } else {
      throw new Error('Unsupported wrapper format');
    }
  };
  const remainingWrappers = [...wrappers];
  const nextWrapper = resolveWrapper(remainingWrappers.pop());
  // --- Component ---
  let cmp;
  $: if (cmp && story.on) {
    const { on: eventHandlers } = story;
    Object.keys(eventHandlers).forEach((event) => {
      const handler = eventHandlers[event];
      cmp.$on(event, handler);
    });
  }
</script>

{#if nextWrapper}
  <svelte:component this={nextWrapper.Component} {...nextWrapper.props}>
    <svelte:self {story} wrappers={remainingWrappers} />
  </svelte:component>
{:else}
  <svelte:component this={story.Component} {...story.props} bind:this={cmp} />
{/if}
