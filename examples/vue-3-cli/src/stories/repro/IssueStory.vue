<template>
  <div v-if="$store">
    Store:
    <pre>{{ $store.state }}</pre>
  </div>
  <p v-else>No registered store here!</p>
</template>
