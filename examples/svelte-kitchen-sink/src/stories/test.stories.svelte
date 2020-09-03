<script>
  import { Meta, Story } from '@storybook/svelte'
  import { action } from '@storybook/addon-actions'

  import Button from './Button.svelte'
</script>

<Meta title="My|Stories" parameters={{ ... }} decorators={[ ... ]} />

<Story name"first" parameters={{ ... }} decorators={[ ... ]}>
          <p>Here's the component:</p>
  <Button>Click me!</Button/>
</Story>

<Story name"actions">
  <Button onClick={action('clicked')}>Click me!</Button/>
</Story>