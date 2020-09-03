<script context="module">
  export const ShowCase = () => ({
    Component: ControlShowcaseView,
  });
</script>

<script>
  import ControlShowcaseView from './views/ControlShowcaseView.svelte';
  import { Meta, Story } from '@storybook/svelte';
  import { action } from '@storybook/addon-actions';
</script>

<Meta title="Svelte|Syntax" />

<Story name="first">
  <p>Here's the component:</p>
  <ControlShowcaseView>Click me!</ControlShowcaseView>
</Story>

<Story name="actions">
  <ControlShowcaseView onClick={action('clicked')}>Click me!</ControlShowcaseView>
</Story>
