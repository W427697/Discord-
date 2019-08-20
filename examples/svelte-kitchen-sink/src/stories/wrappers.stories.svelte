<script>
  import { Meta, Story } from '@storybook/svelte';

  import Wrapper from '../components/Wrapper.svelte';

  const withWrapper = props => storyFn => {
    const {wrappers = [], ...story} = storyFn();
    return {
      ...story,
      wrappers: [
        ...wrappers,
        { Component: Wrapper, props },
      ],
    };
  };

  const blue = withWrapper();

  const red = withWrapper({ red: true });

  const dashedBlue = withWrapper({ dashed: true });

  const dashedRed = withWrapper({ red: true, dashed: true });

  const decorators = [blue, red];
</script>

<style>
  div {
    text-align: center;
  }
</style>

<Meta title="API|wrappers" decorators={[blue, red]} />

<Story name="with decorators" decorators={[dashedBlue, dashedRed]} parameters={{
  notes: `
    This example uses the \`wrappers\` option to make a decorator that wraps our
    story with other components. This technique can be useful to wrap some context
    (i.e. Svelte's setContext/getContext) around your stories components.
  `
}}>
  <div>Gift</div>
</Story>
