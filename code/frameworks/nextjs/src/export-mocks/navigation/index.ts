import type { Mock } from '@storybook/test';
import { fn } from '@storybook/test';
import { NextjsRouterMocksNotAvailable } from '@storybook/core-events/preview-errors';

let navigationAPI: {
  push: Mock;
  replace: Mock;
  forward: Mock;
  back: Mock;
  prefetch: Mock;
  refresh: Mock;
};

/**
 * Creates a next/navigation router API mock. Used internally.
 * @ignore
 * @internal
 * */
const createNavigation = (overrides: any) => {
  const navigationActions = {
    push: fn().mockName('useRouter().push'),
    replace: fn().mockName('useRouter().replace'),
    forward: fn().mockName('useRouter().forward'),
    back: fn().mockName('useRouter().back'),
    prefetch: fn().mockName('useRouter().prefetch'),
    refresh: fn().mockName('useRouter().refresh'),
  };

  if (overrides) {
    Object.keys(navigationActions).forEach((key) => {
      if (key in overrides) {
        (navigationActions as any)[key] = fn((...args: any[]) => {
          return (overrides as any)[key](...args);
        }).mockName(`useRouter().${key}`);
      }
    });
  }

  navigationAPI = navigationActions;

  return navigationAPI;
};

const getRouter = () => {
  if (!navigationAPI) {
    throw new NextjsRouterMocksNotAvailable({
      importType: 'next/navigation',
    });
  }

  return navigationAPI;
};

// re-exports of the actual module
export * from 'next/navigation.actual';

// mock utilities/overrides
export const redirect = fn().mockName('redirect');

export { createNavigation, getRouter };
