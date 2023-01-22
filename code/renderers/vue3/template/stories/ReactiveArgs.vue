<template>
  <button type="button" :class="classes" :style="style">{{ label }} {{ counter }}</button>
</template>

<script lang="typescript">
import { h, computed, reactive } from 'vue';

export default {
  name: 'reactive-args',

  props: {
    label: {
      type: String,
    },

    backgroundColor: {
      type: String
    },
  },

  // @ts-expect-error (Converted from ts-ignore)
  setup(props, { emit }) {
    const classes = {
      'storybook-button': true,
      'storybook-button--primary': true,
      'storybook-button--large': true,
    };
    const style = computed(() => ({
      backgroundColor: props.backgroundColor,
    }));
    const counter = ref(0);
    const onClick = () => {
      emit('click', 1);
      counter.value += 1;
    };

    // Notice that `icon` prop component is still passed through even though it isn't mapped
    return { classes, style, counter }
  },
};
</script>
