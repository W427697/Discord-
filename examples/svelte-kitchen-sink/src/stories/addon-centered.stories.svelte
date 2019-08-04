<script>
  import { Meta, Story } from '@storybook/svelte';
  import Centered from '@storybook/addon-centered/svelte';
  import { action } from '@storybook/addon-actions';

  import Button from '../components/Button.svelte';
</script>

<Meta title="Addon|Centered" decorators={[Centered]} />

<Story name="rounded">
   <Button text="Look, I'm centered!" />
</Story>

<Story name="with action">
  <Button on:click={action("Centered and with actions!")} />
</Story>
