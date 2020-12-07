import React from 'react';
import { StoryFn, StoryContext } from '@storybook/addons';
import { isVue3, Vue } from './vue';

// Inspired by https://github.com/egoist/vue-to-react,
// modified to store args as props in the root store

// FIXME get this from @storybook/vue
const COMPONENT = 'STORYBOOK_COMPONENT';
const VALUES = 'STORYBOOK_VALUES';

function createApp(component: any, args: any, el: string) {
  const vueOptions = {
    data() {
      return {
        [COMPONENT]: component,
        [VALUES]: args,
      };
    },
    render(render: Function) {
      const h = isVue3 ? Vue.h : render;
      const children = this[COMPONENT] ? [h(this[COMPONENT])] : undefined;
      return h('div', { attrs: { id: 'root' } }, children);
    },
  };
  if (isVue3) {
    const app = Vue.createApp(vueOptions);
    app.mount(el);
    return app;
  }
  return new Vue({ ...vueOptions, el });
}

export const prepareForInline = (storyFn: StoryFn, { args }: StoryContext) => {
  const component = storyFn();
  const el = React.useRef(null);

  // FIXME: This recreates the Vue instance every time, which should be optimized
  React.useEffect(() => {
    const root = createApp(component, args, el.current);
    return () => (isVue3 ? root.unmount() : root.$destroy());
  });

  return React.createElement('div', null, React.createElement('div', { ref: el }));
};
