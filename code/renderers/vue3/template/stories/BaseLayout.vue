<script setup lang="ts">

</script>

<template>
  <div>
    <header data-testid="header-slot">
      <slot name="header" title="Some title"></slot>
    </header>
    <main data-testid="default-slot">
      <slot></slot>
    </main>
    <footer data-testid="footer-slot">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
