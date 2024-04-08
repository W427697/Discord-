import type { Mock } from '@storybook/test';
import { fn } from '@storybook/test';
import type { NextRouter } from 'next/router';

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
};

export const createRouter = ({ overrides }: { overrides?: Partial<NextRouter> }) => {
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

    const routerEvents: Partial<NextRouter> = {
      events: {
        on: fn((..._args: any[]) => {}).mockName('nextRouter.events.on'),
        off: fn((..._args: any[]) => {}).mockName('nextRouter.events.off'),
        emit: fn((..._args: any[]) => {}).mockName('nextRouter.events.emit'),
      },
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
      Object.keys(routerEvents.events!).forEach((key) => {
        if (key in routerEvents.events!) {
          (routerEvents.events as any)[key] = fn((...args: any[]) => {
            return (overrides.events as any)[key](...args);
          }).mockName(`nextRouter.events.${key}`);
        }
      });
    }

    routerAPI = {
      ...routerActions,
      // @ts-expect-error TODO improve typings
      events: routerEvents.events,
    };
  }

  return routerAPI;
};

export const useRouter = () => {
  if (!routerAPI) {
    throw new Error('Router not created yet');
  }

  return routerAPI;
};
