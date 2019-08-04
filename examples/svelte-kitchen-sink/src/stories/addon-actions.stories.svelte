<script>
  import { Meta, Story } from '@storybook/svelte';
  import { action } from '@storybook/addon-actions';

  import Button from '../components/Button.svelte';
</script>

<Meta title="Addon|Action" />

<Story name="Action on view method">
  <Button on:click={action('I am logging in the actions tab')}></Button>
</Story>

<Story name="Action on component method">
  <Button on:click={action('I am logging in the actions tab too')}></Button>
</Story>
