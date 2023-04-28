import { global } from '@junk-temporary-prototypes/global';
import hasDependency from '../hasDependency';
import configure from '../configure';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return (
    options.framework === 'svelte' || (!options.framework && hasDependency('@junk-temporary-prototypes/svelte'))
  );
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'svelte';

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

  jest.mock('@junk-temporary-prototypes/svelte', () => {
    const renderAPI = jest.requireActual('@junk-temporary-prototypes/svelte');

    renderAPI.addDecorator = mockStartedAPI.clientApi.addDecorator;
    renderAPI.addParameters = mockStartedAPI.clientApi.addParameters;

    return renderAPI;
  });

  // eslint-disable-next-line global-require
  const storybook = require('@junk-temporary-prototypes/svelte');

  configure({
    ...options,
    storybook,
  });
  return {
    framework: 'svelte' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for svelte');
    },
    storybook,
  };
}

const svelteLoader: Loader = {
  load,
  test,
};

export default svelteLoader;
