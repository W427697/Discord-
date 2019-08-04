<script>
  import { Meta, Story } from '@storybook/svelte'
  import Button from '../components/Button.svelte'
</script>

<Meta title="Button" />

<Story name="rounded">
  <Button rounded message="Rounded text" />
</Story>

<Story name="square">
  <Button rounded={false} message="Squared text" />
</Story>
