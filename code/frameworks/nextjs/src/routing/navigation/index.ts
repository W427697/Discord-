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

export const createNavigation = (overrides: any) => {
  if (!navigationAPI) {
    const navigationActions = {
      push: fn().mockName('nextNavigation.push'),
      replace: fn().mockName('nextNavigation.replace'),
      forward: fn().mockName('nextNavigation.forward'),
      back: fn().mockName('nextNavigation.back'),
      prefetch: fn().mockName('nextNavigation.prefetch'),
      refresh: fn().mockName('nextNavigation.refresh'),
    };

    if (overrides) {
      Object.keys(navigationActions).forEach((key) => {
        if (key in overrides) {
          (navigationActions as any)[key] = fn((...args: any[]) => {
            return (overrides as any)[key](...args);
          }).mockName(`nextNavigation.${key}`);
        }
      });
    }

    navigationAPI = navigationActions;
  }

  return navigationAPI;
};

export const useRouter = () => {
  if (!navigationAPI) {
    throw new NextjsRouterMocksNotAvailable({
      importType: 'next/navigation',
    });
  }

  return navigationAPI;
};
