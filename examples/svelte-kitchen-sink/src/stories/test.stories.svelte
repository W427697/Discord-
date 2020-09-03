<script>
  import { Meta, Story } from '@storybook/svelte';
  import { action } from '@storybook/addon-actions';

  import Button from '../components/Button.svelte';
</script>

<Meta title="My|Stories"  />

<Story name="first" >
  <p>Here's the component:</p>
  <Button>Click me!</Button>
</Story>

<Story name="actions">
  <Button onClick={action('clicked')}>Click me!</Button>
</Story>
