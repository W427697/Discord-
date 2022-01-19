<template>
  <button type="button" :class="classes" @click="onClick">
    <slot name="icon" />
    <slot />
  </button>
</template>

<script lang="typescript">
import '../../button.css';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: "ComplexButton",

  emits: ['click'],

  // @ts-ignore
  setup(props, { emit }) {
    return {
      classes: computed(() => ({
        'storybook-button': true,
      })),
      onClick() {
        emit('click');
      }
    }
  },
});
</script>
