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

  let mockStartedAPI: any;

  jest.mock('@storybook/core-client', () => {
    const coreClientAPI = jest.requireActual('@storybook/core-client');

    return {
      ...coreClientAPI,
      start: (...args: any[]) => {
        mockStartedAPI = coreClientAPI.start(...args);
        return mockStartedAPI;
      },
    };
  });

  jest.mock('@storybook/vue3', () => {
    const renderAPI = jest.requireActual('@storybook/vue3');

    renderAPI.addDecorator = mockStartedAPI.clientApi.addDecorator;
    renderAPI.addParameters = mockStartedAPI.clientApi.addParameters;

    return renderAPI;
  });

  // eslint-disable-next-line global-require
  const storybook = require('@storybook/vue3');

  configure({
    ...options,
    storybook,
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
