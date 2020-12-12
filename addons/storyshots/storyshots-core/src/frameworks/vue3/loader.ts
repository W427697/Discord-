import global from 'global';
import hasDependency from '../hasDependency';
import configure from '../configure';
import { Loader } from '../Loader';
import { StoryshotsOptions } from '../../api/StoryshotsOptions';

function mockVueToIncludeCompiler() {
  jest.mock('vue', () => jest.requireActual('vue/dist/vue.cjs.js'));
}

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'vue3' || (!options.framework && hasDependency('@storybook/vue3'));
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'vue';
  mockVueToIncludeCompiler();

  const storybook = jest.requireActual('@storybook/vue3');

  configure({ ...options, storybook });

  return {
    framework: 'vue3' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for vue');
    },
    storybook,
  };
}

const vueLoader: Loader = {
  load,
  test,
};

export default vueLoader;
