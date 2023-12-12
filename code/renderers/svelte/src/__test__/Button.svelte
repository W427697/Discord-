<script lang="ts">
  const { createEventDispatcher } = require('svelte');

  let disabled: boolean = false;
  let label: string = '';

  module.exports = {
    disabled,
    label
  };

  const dispatch = createEventDispatcher();
</script>

<button on:click={(e) => dispatch('clicked', e)} on:dblclick on:mousemove {disabled}>
  {label}
</button>
