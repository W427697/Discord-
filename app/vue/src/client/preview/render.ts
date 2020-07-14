import dedent from 'ts-dedent';
import Vue, { VNode, VueConstructor, FunctionalComponentOptions } from 'vue';
import { RenderContext, COMPONENT, VALUES } from './types';

const root = new Vue({
  data(): Record<string, any> {
    return {
      [COMPONENT]: undefined,
      [VALUES]: {},
    };
  },
  render(h): VNode {
    const children = this[COMPONENT] ? [h(this[COMPONENT])] : undefined;
    return h('div', { attrs: { id: 'root' } }, children);
  },
});

export default function render({
  storyFn,
  kind,
  name,
  args,
  showMain,
  showError,
  showException,
  forceRender,
}: RenderContext<VueConstructor>): void {
  Vue.config.errorHandler = showException;

  // FIXME: move this into root[COMPONENT] = element
  // once we get rid of knobs so we don't have to re-create
  // a new component each time
  const element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Vue component from the story: "${name}" of "${kind}".`,
      description: dedent`
        Did you forget to return the Vue component from the story?
        Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    });
    return;
  }

  showMain();

  // at component creation || refresh by HMR or switching stories
  if (!root[COMPONENT] || !forceRender) {
    root[COMPONENT] = element;
  }

  root[VALUES] = { ...(element.options as FunctionalComponentOptions)[VALUES], ...args };

  if (!root.$el) {
    root.$mount('#root');
  }
}
