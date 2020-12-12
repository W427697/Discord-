import * as Vue from 'vue';
import { document } from 'global';

const { createApp, h } = Vue as any;

const PROPS = 'STORYBOOK_PROPS';

function getRenderedTree(story: any) {
  const component = story.render();

  const target = document.createElement('div');

  const vm = createApp({
    provide() {
      return {
        [PROPS]: story.args,
      };
    },
    render() {
      return h(component);
    },
  });

  return vm.mount(target).$el;
}

export default getRenderedTree;
