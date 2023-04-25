<template>
  <div v-bind="$attrs">
    <button :disabled="disable" type="button" @click="$emit('clicked', 'from the button')">
      Click Me
    </button>

  </div>
  <div class="clickable">Click Me but I shouldn't do anything</div>
</template>

<script setup>
const emit = defineEmits(['clicked']);

const props = defineProps({
  disable: {
    type: Boolean,

    default: false,
  },
});
</script>

<style>
.clickable {
  cursor: pointer;

  margin: 1em;
}
</style>
