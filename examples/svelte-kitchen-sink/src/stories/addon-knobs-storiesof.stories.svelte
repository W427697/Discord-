<script>
  import { Meta, Story } from '@storybook/svelte';
  import { withKnobs, text, number } from '@storybook/addon-knobs';

  import ActionKnobView from './views/ActionKnobView.svelte';
</script>

<Meta title="Addon|Knobs partial" decorators={[withKnobs]} />

<Story name="Action on view method">
  <ActionKnobView
    backgroundColor={text('Background', 'green')}
    width={number('Width', 200, { range: true, min: 100, max: 1000, step: 100 })}
    height={number('Height', 200, { range: true, min: 100, max: 1000, step: 100 })}
  />
</Story>
