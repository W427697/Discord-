<template>
  <div class="button" :class="`size-${size}`">
    <!-- @slot Button content, e.g. label text -->
    <slot></slot>
  </div>
</template>

<script>
import { version } from 'vue'
export default {
  name: 'salam',
  props: {
    size: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      version
    }
  }
}
</script>

<style lang="scss">
.button {
  border: 1px solid #000;
  line-height: 2em;
  padding: 0 1em;
  display: inline-block;
  border-radius: 3px;

  &.size-small {
    font-size: 0.8em;
  }
  &.size-big {
    font-size: 1.5em;
  }
}
</style>
