<script setup lang="ts">
defineProps<{label: string}>();
</script>
<template>
  <div>
    <label>
      Some input:
      <input style='width: 400px' placeholder='If you see this, an args update caused the input field to loose state'/>
    </label>
    <div>{{ label }}</div>
    <header data-testid="header-slot">
      <slot name="header" title="Header title from the slot"></slot>
    </header>
    <main data-testid="default-slot">
      <slot></slot>
    </main>
    <footer data-testid="footer-slot">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
