<script>
  export let red = false;
  export let dashed = false;
</script>

<style>
  div {
    border: 5px solid skyblue;
    padding: 5px;
  }
  .red {
    border-color: pink;
  }
  .dashed {
    border-style: dashed;
  }
</style>

<div class:red class:dashed>
  <slot />
</div>
