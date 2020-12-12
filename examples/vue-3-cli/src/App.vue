<template>
  <div>
    Welcome to Your Vue {{ version }} App
    <br />
    <Button ref="btn">TEST</Button>
  </div>
</template>

<script>
import { version } from 'vue';
import Button from './button/Button'

export default {
  components: {
    Button,
  },
  setup() {
    return {
      version
    }
  }
}
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
