import global from 'global';
import configure from '../configure';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'web-components';
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'web-components';

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

  jest.mock('@storybook/html', () => {
    const renderAPI = jest.requireActual('@storybook/html');

    renderAPI.addDecorator = mockStartedAPI.clientApi.addDecorator;
    renderAPI.addParameters = mockStartedAPI.clientApi.addParameters;

    return renderAPI;
  });

  // eslint-disable-next-line global-require
  const storybook = require('@storybook/html');

  configure({
    ...options,
    storybook,
  });

  return {
    framework: 'web-components' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for web-components');
    },
    storybook,
  };
}

const webComponentsLoader: Loader = {
  load,
  test,
};

export default webComponentsLoader;
