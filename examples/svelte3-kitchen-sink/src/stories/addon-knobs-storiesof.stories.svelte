<script>
  import { storiesOf, Story, StoriesOf } from '@storybook/svelte3';
  import { withKnobs, text, number } from '@storybook/addon-knobs';

  import ActionKnobView from './views/ActionKnobView.svelte';

  storiesOf(module).addDecorator(withKnobs);

</script>

<StoriesOf kind="Addon|Knobs partial">
  <Story name="Action on view method">
    <ActionKnobView
      backgroundColor={text('Background', 'green')}
      width={number('Width', 200, { range: true, min: 100, max: 1000, step: 100 })}
      height={number('Height', 200, { range: true, min: 100, max: 1000, step: 100 })}
    />
  </Story>
</StoriesOf>
