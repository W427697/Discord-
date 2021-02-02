<script>
  import { Meta, Story } from '@storybook/svelte';
  import { action } from '@storybook/addon-actions';

  import Button from '../../components/Button.svelte';
</script>

<Meta title="Addon/Actions (Svelte)" component={Button}/>

<Story name="Action on component method">
  <Button text="Custom text" on:click={action('I am logging in the actions tab')}/>
</Story>

