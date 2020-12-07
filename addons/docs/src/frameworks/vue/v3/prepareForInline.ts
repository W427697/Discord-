import React from 'react';
import { StoryFn, StoryContext, Args } from '@storybook/addons';
// @ts-ignore
import { h, createApp, reactive } from 'vue';

// Inspired by https://github.com/egoist/vue-to-react,
// modified to store args as props in the root store

export const prepareForInline = (storyFn: StoryFn, { args }: StoryContext) => {
  const component = storyFn();
  const el = React.useRef(null);
  const propsContainer = reactive<{ props: Args }>({ props: args || {} });

  const root = createApp({
    setup() {
      return () =>
        h('div', { attrs: { id: 'root' } }, component ? [h(component, propsContainer.props)] : []);
    },
  });

  React.useEffect(() => {
    propsContainer.props = args;
    root.mount(el.current);
    return () => root.unmount(el.current);
  });

  return React.createElement('div', null, React.createElement('div', { ref: el }));
};
