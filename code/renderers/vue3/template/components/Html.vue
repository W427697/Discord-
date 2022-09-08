<template>
  <div v-html="contents"></div>
</template>

<script>

export default {
  name: 'my-html',

  props: {
    contents: {
      type: String,
      required: true,
    },
  },


  setup() { },
};
</script>
