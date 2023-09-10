<template>
  <pre>
{{ JSON.stringify($props, null, 2)  }}
  </pre>
</template>

<script lang="ts" setup >
 defineProps<{label:string ,stringOrNumber?: string | number,booleanOrNumber?:boolean | number }>();
</script>
