<script>
  /* eslint-disable import/no-mutable-exports */

  import styles from '@storybook/addon-centered/dist/styles';
  import json2CSS from '@storybook/addon-centered/dist/helpers/json2CSS';

  const style = json2CSS(styles.style);
  const innerStyle = json2CSS(styles.innerStyle);

  export let Story;
</script>

<div style={style}>
  <div style={innerStyle}>
    <svelte:component this={Story} />
  </div>
</div>
