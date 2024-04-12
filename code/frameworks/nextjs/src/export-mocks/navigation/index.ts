import type { Mock } from '@storybook/test';
import { fn } from '@storybook/test';
import { NextjsRouterMocksNotAvailable } from '@storybook/core-events/preview-errors';
import * as originalNavigation from 'next/navigation.actual';

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

// mock utilities/overrides (as of Next v14.2.0)
const redirect = fn().mockName('redirect');

// passthrough mocks - keep original implementation but allow for spying
const useSearchParams = fn(originalNavigation.useSearchParams).mockName('useSearchParams');
const usePathname = fn(originalNavigation.usePathname).mockName('usePathname');
const useSelectedLayoutSegment = fn(originalNavigation.useSelectedLayoutSegment).mockName(
  'useSelectedLayoutSegment'
);
const useSelectedLayoutSegments = fn(originalNavigation.useSelectedLayoutSegments).mockName(
  'useSelectedLayoutSegments'
);
const useRouter = fn(originalNavigation.useRouter).mockName('useRouter');
const useServerInsertedHTML = fn(originalNavigation.useServerInsertedHTML).mockName(
  'useServerInsertedHTML'
);
const notFound = fn(originalNavigation.notFound).mockName('notFound');
const permanentRedirect = fn(originalNavigation.permanentRedirect).mockName('permanentRedirect');

// Params, not exported by Next.js, is manually declared to avoid inference issues.
interface Params {
  [key: string]: string | string[];
}
const useParams = fn<[], Params>(originalNavigation.useParams).mockName('useParams');

export {
  createNavigation,
  getRouter,
  redirect,
  useSearchParams,
  usePathname,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
  useParams,
  useRouter,
  useServerInsertedHTML,
  notFound,
  permanentRedirect,
};
