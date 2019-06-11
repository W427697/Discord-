<script>
  import { storiesOf, Story } from '@storybook/svelte3';
  import ButtonView from './views/ButtonView.svelte';

  storiesOf('Addon|Backgrounds', module).addParameters({
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  });
</script>

<Story name="story 1">
  <ButtonView />
</Story>
