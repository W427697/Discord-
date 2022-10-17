import configure from '../configure';
import hasDependency from '../hasDependency';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return options.framework === 'react' || (!options.framework && hasDependency('@storybook/react'));
}

function load(options: StoryshotsOptions) {
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
