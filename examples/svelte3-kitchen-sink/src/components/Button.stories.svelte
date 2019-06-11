<script>
  import { storiesOf, Story } from '@storybook/svelte3';

  import Button from './Button.svelte';

  // Custom Svelte specific storiesOf, that allows a more concise syntax to
  // pass module (see next example for verbose alternative)
  storiesOf('components|Button', module);
</script>

<Story name="default">
  <Button />
</Story>

<Story name="rounded">
  <Button rounded />
</Story>
