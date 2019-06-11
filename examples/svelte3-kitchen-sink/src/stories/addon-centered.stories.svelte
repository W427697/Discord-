<script>
  import { storiesOf, Story } from '@storybook/svelte3';
  import Centered from '@storybook/svelte3/src/addons/centered';
  import { action } from '@storybook/addon-actions';

  import Button from '../components/Button.svelte';

  storiesOf('Addon|Centered', module).addDecorator(Centered);
</script>

<Story name="rounded">
   <Button text="Look, I'm centered!" />
</Story>

<Story name="with action">
  <Button on:click={action("Centered and with actions!")} />
</Story>
