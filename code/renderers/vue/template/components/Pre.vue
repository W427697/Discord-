<template>
  <pre data-testid="pre" :style="style">{{ finalText }}</pre>
</template>

<script>
export default {
  name: 'my-pre',

  props: {
    // deepscan-disable-next-line
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

  computed: {
    finalText() {
      return props.object ? JSON.stringify(props.object, null, 2) : props.text;
    },
  },
};
</script>
