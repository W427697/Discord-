<template>
  <pre>
{{ JSON.stringify($props, null, 2)  }}
  </pre>
</template>

<script lang="ts" setup >
 defineProps<
 {
  /**
   * label
   */
  label:string ,
  /**
   * stringOrNumber
   */
  stringOrNumber?: string | number,
  /**
   * booleanOrNumber
   */
  booleanOrNumber?:boolean | number,
  /**
   * multiple
   */
  multiple?:object | string | number | boolean ,
  
  
  }>();
</script>
