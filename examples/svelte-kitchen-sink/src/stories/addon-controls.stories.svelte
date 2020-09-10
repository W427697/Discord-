<script>
  import ControlShowcaseView from './views/ControlShowcaseView.svelte';
  import { Meta, Story } from '@storybook/svelte';
  import { action } from '@storybook/addon-actions';
  import { withKnobs, text, number } from '@storybook/addon-knobs';
  import Button from '../components/Button.svelte';

  const parameters = {
    storySource: {
      source: 'insert source code here :(',
    },
  };

  const argTypes = {
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
  };
</script>

<Meta title="Svelte Syntax" component={ControlShowcaseView} {argTypes} />
<Story name="with Controls">
  <ControlShowcaseView />
</Story>

<Story name="with Actions and Knobs" component={Button} decorators={[withKnobs]}>
  <Button on:click={action('clicked inside svelte CSF')} text={text('Display', 'Text Here')} />
</Story>
