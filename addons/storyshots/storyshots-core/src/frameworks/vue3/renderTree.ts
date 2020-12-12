import * as Vue from 'vue';

const { createApp, h } = Vue as any;

const PROPS = 'STORYBOOK_PROPS';

function getRenderedTree(story: any) {
  const component = story.render();

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

  return vm.mount();
}

export default getRenderedTree;
