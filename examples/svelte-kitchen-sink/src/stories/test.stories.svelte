<script>
  import ControlShowcaseView from './views/ControlShowcaseView.svelte';
  import { Meta, Story } from '@storybook/svelte';
  import { action } from '@storybook/addon-actions';
  import { withKnobs, text, number } from '@storybook/addon-knobs';

  const paramTest = {
    myAddon: {
      data: 'this data is passed to the addon',
    },
    argTypes: {
      range: { defaultValue: 0, control: { type: 'range', min: 0, max: 100 } },
      loadingState: {
        control: {
          type: 'inline-radio',
          options: ['loading', 'error', 'ready'],
        },
      },
      food: {
        control: {
          type: 'inline-check',
          options: ['apple', 'banana', 'orange'],
        },
      },
      car: {
        control: {
          type: 'select',
          options: ['Truck', 'SUV', 'Tesla'],
        },
      },
      color: {
        control: 'color',
      },
      date: {
        control: 'date',
      },
    },
  };
</script>

<Meta title="Svelte-Syntax" decorators={[withKnobs]} />

<Story name="default" parameters={paramTest}>
  <p>Here's the component:</p>
  <ControlShowcaseView>Click me!</ControlShowcaseView>
</Story>

<Story name="with actions">
  <p>with actions:</p>
  <ControlShowcaseView onClick={action('clicked')}>Click me!</ControlShowcaseView>
</Story>

<Story name="with knobs">
  <p>with knobs:</p>
  <ControlShowcaseView
    onClick={action('clicked')}
    count={number('Width', 200, { range: true, min: 100, max: 1000, step: 100 })}
    text={text('Background', 'green')}>
    Click me!
  </ControlShowcaseView>
</Story>
