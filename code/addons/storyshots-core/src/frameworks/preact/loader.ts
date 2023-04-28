/** @jsxRuntime classic */
/** @jsx h */

import { global } from '@storybook/global';
import configure from '../configure';
import hasDependency from '../hasDependency';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return (
    options.framework === 'preact' || (!options.framework && hasDependency('@junk-temporary-prototypes/preact'))
  );
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'preact';

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

  jest.mock('@junk-temporary-prototypes/preact', () => {
    const renderAPI = jest.requireActual('@junk-temporary-prototypes/preact');

    renderAPI.addDecorator = mockStartedAPI.clientApi.addDecorator;
    renderAPI.addParameters = mockStartedAPI.clientApi.addParameters;

    return renderAPI;
  });

  // eslint-disable-next-line global-require
  const storybook = require('@junk-temporary-prototypes/preact');

  configure({
    ...options,
    storybook,
  });

  return {
    framework: 'preact' as const,
    renderTree: jest.requireActual('./renderTree').default,
    renderShallowTree: () => {
      throw new Error('Shallow renderer is not supported for preact');
    },
    storybook,
  };
}

const preactLoader: Loader = {
  load,
  test,
};

export default preactLoader;
