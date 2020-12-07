<template>
  <div>
    Welcome to Your Vue {{ version }} App
    <br>
    <Button ref="btn">TEST</Button>
  </div>
</template>

<script setup>
import { version, onMounted, ref } from 'vue'
import Button from './button/Button'

const btn = ref(null)

onMounted(() => {
  window.app = btn;
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
