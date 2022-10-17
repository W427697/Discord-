import global from 'global';
import hasDependency from '../hasDependency';
import configure from '../configure';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'vue3' || (!options.framework && hasDependency('@storybook/vue3'));
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'vue3';

  const storybook = jest.requireActual('@storybook/html');
  const clientAPI = jest.requireActual('@storybook/client-api');

  configure({
    ...options,
    storybook: {
      ...clientAPI,
      ...storybook,
    },
  });

  return {
    framework: 'vue3' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for Vue 3');
    },
    storybook,
  };
}

const vueLoader: Loader = {
  load,
  test,
};

export default vueLoader;
