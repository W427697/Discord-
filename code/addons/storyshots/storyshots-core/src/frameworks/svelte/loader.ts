import global from 'global';
import hasDependency from '../hasDependency';
import configure from '../configure';
import type { Loader } from '../Loader';
import type { StoryshotsOptions } from '../../api/StoryshotsOptions';

function test(options: StoryshotsOptions): boolean {
  return (
    options.framework === 'svelte' || (!options.framework && hasDependency('@storybook/svelte'))
  );
}

function load(options: StoryshotsOptions) {
  global.STORYBOOK_ENV = 'svelte';

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
