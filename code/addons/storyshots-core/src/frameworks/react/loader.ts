import configure from '../configure';
import hasDependency from '../hasDependency';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'react' || (!options.framework && hasDependency('@junk-temporary-prototypes/react'));
}

function load(options: StoryshotsOptions) {
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

  jest.mock('@junk-temporary-prototypes/react', () => {
    const renderAPI = jest.requireActual('@junk-temporary-prototypes/react');

    renderAPI.addDecorator = mockStartedAPI.clientApi.addDecorator;
    renderAPI.addParameters = mockStartedAPI.clientApi.addParameters;

    return renderAPI;
  });

  // eslint-disable-next-line global-require
  const storybook = require('@junk-temporary-prototypes/react');

  configure({
    ...options,
    storybook,
  });

  return {
    framework: 'react' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: jest.requireActual('./renderShallowTree').default,
    storybook,
  };
}

const reactLoader: Loader = {
  load,
  test,
};

export default reactLoader;
