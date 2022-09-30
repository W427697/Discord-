import * as Vue from 'vue';

const { document } = globalThis;

// This is cast as `any` to workaround type errors caused by Vue 2 types
const { h, createApp } = Vue as any;

function getRenderedTree(story: any) {
  const component = story.render();

  const app = createApp({
    render() {
      return h(component, story.args);
    },
  });

  const vm = app.mount(document.createElement('div'));
  vm.$forceUpdate();
  return vm.$el;
}

export default getRenderedTree;
