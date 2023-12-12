<script lang="ts">
  let decoratorArg: string = '';

  module.exports = {
    decoratorArg
  }
</script>

<div>
  Decorator: {decoratorArg}
  <slot />
</div>
