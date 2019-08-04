<script>
  import { Meta, Story } from '@storybook/svelte';
  import ButtonView from './views/ButtonView.svelte';

  const parameters = [
    {
      backgrounds: [
        { name: 'light', value: '#eeeeee' },
        { name: 'dark', value: '#222222', default: true },
      ],
    }
  ]
</script>

<Meta title="Addon|Backgrounds" {parameters} />

<Story name="story 1">
  <ButtonView />
</Story>
