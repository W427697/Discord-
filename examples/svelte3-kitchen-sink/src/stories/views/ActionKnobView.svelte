<script>
  /* eslint-disable import/no-mutable-exports */

  export let width = 200;
  export let height = 100;
  export let backgroundColor = 'yellow';

  $: style = `
    width: ${width}px;
    height: ${height}px;
    background-color: ${backgroundColor}
  `;
</script>

<div {style}>
    <p>I am interactive</p>
</div>
