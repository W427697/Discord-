<script>
// https://v3.vuejs.org/guide/component-slots.html#scoped-slots
export default {
  name: 'todo-list',
  data() {
    return {
      items: ['Feed a cat', 'Buy milk'],
    };
  },
};
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item">
      <slot :item="item"></slot>
    </li>
  </ul>
</template>
