<script>
  import { Meta, Story } from '@storybook/svelte';
  import Centered from '@storybook/addon-centered/svelte';

  const makeStyledDecorator = style => storyFn => {
    const { domWrappers = [], ...story } = storyFn();
    const wrapper = target => {
      const div = document.createElement('div');
      Object.assign(div.style, style);
      target.appendChild(div);
      return div;
    }
    return {
      ...story,
      domWrappers: [...domWrappers, wrapper],
    };
  };

  const cyan = makeStyledDecorator({
    border: '5px solid cyan',
    padding: '5px',
  });

  const magenta = makeStyledDecorator({
    border: '5px solid magenta',
    padding: '5px',
  });
</script>

<Meta title="API|domWrapper" decorators={[Centered]} />

<Story name="with decorators" decorators={[cyan, magenta]} parameters={{
  notes: `
    This example uses the \`domWrappers\` option to make a decorator that wraps
    our story with some custom DOM elements. This can be useful for custom
    formatting, but it is especially handy for addons.
  `
}}>
  <div>Hello</div>
</Story >
