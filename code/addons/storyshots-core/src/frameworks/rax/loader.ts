import { global } from '@junk-temporary-prototypes/global';
import configure from '../configure';
import hasDependency from '../hasDependency';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'rax' || (!options.framework && hasDependency('@junk-temporary-prototypes/rax'));
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'rax';

  let mockStartedAPI: any;

  jest.mock('@junk-temporary-prototypes/preview-api', () => {
    const previewAPI = jest.requireActual('@junk-temporary-prototypes/preview-api');

    return {
      ...previewAPI,
      start: (...args: any[]) => {
        mockStartedAPI = previewAPI.start(...args);
        return mockStartedAPI;
      },
    };
  });

  jest.mock('@junk-temporary-prototypes/rax', () => {
    const renderAPI = jest.requireActual('@junk-temporary-prototypes/rax');

    renderAPI.addDecorator = mockStartedAPI.clientApi.addDecorator;
    renderAPI.addParameters = mockStartedAPI.clientApi.addParameters;

    return renderAPI;
  });

  // eslint-disable-next-line global-require
  const storybook = require('@junk-temporary-prototypes/rax');

  configure({
    ...options,
    storybook,
  });

  return {
    framework: 'rax' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for rax');
    },
    storybook,
  };
}

const raxLoader: Loader = {
  load,
  test,
};

export default raxLoader;
