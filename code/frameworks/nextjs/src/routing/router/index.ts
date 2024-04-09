import type { Mock } from '@storybook/test';
import { fn } from '@storybook/test';
import { NextjsRouterMocksNotAvailable } from '@storybook/core-events/preview-errors';
import type { NextRouter } from 'next/router';
import singletonRouter from 'next/router';

const defaultRouterState = {
  route: '/',
  asPath: '/',
  basePath: '/',
  pathname: '/',
  query: {},
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
};

let routerAPI: {
  push: Mock;
  replace: Mock;
  reload: Mock;
  back: Mock;
  forward: Mock;
  prefetch: Mock;
  beforePopState: Mock;
  events: {
    on: Mock;
    off: Mock;
    emit: Mock;
  };
} & typeof defaultRouterState;

export const createRouter = (overrides: Partial<NextRouter>) => {
  if (!routerAPI) {
    const routerActions: Partial<NextRouter> = {
      push: fn((..._args: any[]) => {
        return Promise.resolve(true);
      }).mockName('nextRouter.push'),
      replace: fn((..._args: any[]) => {
        return Promise.resolve(true);
      }).mockName('nextRouter.replace'),
      reload: fn((..._args: any[]) => {}).mockName('nextRouter.reload'),
      back: fn((..._args: any[]) => {}).mockName('nextRouter.back'),
      forward: fn(() => {}).mockName('nextRouter.forward'),
      prefetch: fn((..._args: any[]) => {
        return Promise.resolve();
      }).mockName('nextRouter.prefetch'),
      beforePopState: fn((..._args: any[]) => {}).mockName('nextRouter.beforePopState'),
    };

    const routerEvents: NextRouter['events'] = {
      on: fn((..._args: any[]) => {}).mockName('nextRouter.events.on'),
      off: fn((..._args: any[]) => {}).mockName('nextRouter.events.off'),
      emit: fn((..._args: any[]) => {}).mockName('nextRouter.events.emit'),
    };

    if (overrides) {
      Object.keys(routerActions).forEach((key) => {
        if (key in overrides) {
          (routerActions as any)[key] = fn((...args: any[]) => {
            return (overrides as any)[key](...args);
          }).mockName(`nextRouter.${key}`);
        }
      });
    }

    if (overrides?.events) {
      Object.keys(routerEvents).forEach((key) => {
        if (key in routerEvents) {
          (routerEvents as any)[key] = fn((...args: any[]) => {
            return (overrides.events as any)[key](...args);
          }).mockName(`nextRouter.events.${key}`);
        }
      });
    }

    routerAPI = {
      ...defaultRouterState,
      ...overrides,
      ...routerActions,
      // @ts-expect-error TODO improve typings
      events: routerEvents,
    };

    // overwrite the singleton router from next/router
    singletonRouter.router = routerAPI as any;
    singletonRouter.readyCallbacks.forEach((cb) => cb());
    singletonRouter.readyCallbacks = [];
  }

  return routerAPI as unknown as NextRouter;
};

export const useRouter = () => {
  if (!routerAPI) {
    throw new NextjsRouterMocksNotAvailable({
      importType: 'next/router',
    });
  }

  return routerAPI;
};
