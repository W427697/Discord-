<template>
  <pre data-testid="pre" :style="style">{{ text }}</pre>
</template>

<script>
import { reactive, computed } from 'vue';

export default {
  name: 'my-pre',

  props: {
    style: {
      type: Object,
    },
    object: {
      type: Object,
    },
    text: {
      type: String,
      default: '',
    },
  },

  setup(props, { emit }) {
    props = reactive(props);
    return {
      text: computed(() => (props.object ? JSON.stringify(props.object, null, 2) : props.text)),
    };
  },
};
</script>
