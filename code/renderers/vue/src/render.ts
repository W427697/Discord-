/* eslint-disable no-underscore-dangle */
import { dedent } from 'ts-dedent';
import Vue from 'vue';
import type { RenderContext } from '@storybook/store';
import type { ArgsStoryFn } from '@storybook/csf';
import { CombinedVueInstance } from 'vue/types/vue';
import type { StoryFnVueReturnType, VueFramework } from './types';

const map = new Map<Element, Instance>();
type Instance = CombinedVueInstance<Vue, object, object, object, Record<never, any>>;

export const render: ArgsStoryFn<VueFramework> = (args, context) => {
  const { id, component: Component, argTypes } = context;
  const component = Component as VueFramework['component'] & {
    __docgenInfo?: { displayName: string };
    props: Record<string, any>;
  };

  if (!component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  let componentName = 'component';

  // if there is a name property, we either use it or preprend with sb- in case it's an invalid name
  if (component.name) {
    // @ts-expect-error isReservedTag is an internal function from Vue, might be changed in future releases
    const isReservedTag = Vue.config.isReservedTag && Vue.config.isReservedTag(component.name);

    componentName = isReservedTag ? `sb-${component.name}` : component.name;
  } else if (component.__docgenInfo?.displayName) {
    // otherwise, we use the displayName from docgen, if present
    componentName = component.__docgenInfo?.displayName;
  }

  return {
    data: () => ({ args }),
    components: { [componentName]: component },
    template: `<${componentName} v-bind="args" />`,
  };
};

export function renderToDOM(
  { title, name, storyFn, showMain, showError, showException }: RenderContext<VueFramework>,
  domElement: Element
) {
  let mountTarget: Element;
  let element: StoryFnVueReturnType;

  // Vue2 mount always replaces the mount target with Vue-generated DOM.
  // https://v2.vuejs.org/v2/api/#el:~:text=replaced%20with%20Vue%2Dgenerated%20DOM
  // We cannot mount to the domElement directly, because it would be replaced. That would
  // break the references to the domElement like canvasElement used in the play function.
  // Instead, we mount to a child element of the domElement, creating one if necessary.
  if (domElement.hasChildNodes()) {
    mountTarget = domElement.firstElementChild;
  } else {
    mountTarget = document.createElement('div');
    domElement.appendChild(mountTarget);
  }

  const storybookApp = new Vue({
    beforeDestroy() {
      map.delete(domElement);
    },
    render(h) {
      map.set(domElement, storybookApp);
      return h(element);
    },
  });

  Vue.config.errorHandler = showException;
  element = storyFn();

  if (!element) {
    showError({
      title: `Expecting a Vue component from the story: "${name}" of "${title}".`,
      description: dedent`
        Did you forget to return the Vue component from the story?
        Use "() => ({ template: '<my-comp></my-comp>' })" or "() => ({ components: MyComp, template: '<my-comp></my-comp>' })" when defining the story.
      `,
    });
    return;
  }

  showMain();

  if (map.has(domElement)) {
    map.get(domElement).$destroy();
  }

  storybookApp.$mount(mountTarget);
}
