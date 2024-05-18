import type { Addon_DecoratorFunction, Addon_LoaderFunction } from '@storybook/core/dist/types';
import './config/preview';
import { ImageDecorator } from './images/decorator';
import { RouterDecorator } from './routing/decorator';
import { StyledJsxDecorator } from './styledJsx/decorator';
import { HeadManagerDecorator } from './head-manager/decorator';

// We need this import to be a singleton, and because it's used in multiple entrypoints
// both in ESM and CJS, importing it via the package name instead of having a local import
// is the only way to achieve it actually being a singleton
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore we must ignore types here as during compilation they are not generated yet
import { cookies, headers } from '@storybook/nextjs/headers.mock';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore we must ignore types here as during compilation they are not generated yet
import { createRouter } from '@storybook/nextjs/router.mock';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore we must ignore types here as during compilation they are not generated yet
import { createNavigation } from '@storybook/nextjs/navigation.mock';
import { isNextRouterError } from 'next/dist/client/components/is-next-router-error';

function addNextHeadCount() {
  const meta = document.createElement('meta');
  meta.name = 'next-head-count';
  meta.content = '0';
  document.head.appendChild(meta);
}

function isAsyncClientComponentError(error: unknown) {
  return (
    typeof error === 'string' &&
    (error.includes('A component was suspended by an uncached promise.') ||
      error.includes('async/await is not yet supported in Client Components'))
  );
}
addNextHeadCount();

// Copying Next patch of console.error:
// https://github.com/vercel/next.js/blob/a74deb63e310df473583ab6f7c1783bc609ca236/packages/next/src/client/app-index.tsx#L15
const origConsoleError = globalThis.console.error;
globalThis.console.error = (...args: unknown[]) => {
  const error = args[0];
  if (isNextRouterError(error) || isAsyncClientComponentError(error)) {
    return;
  }
  origConsoleError.apply(globalThis.console, args);
};

globalThis.addEventListener('error', (ev: WindowEventMap['error']): void => {
  if (isNextRouterError(ev.error) || isAsyncClientComponentError(ev.error)) {
    ev.preventDefault();
    return;
  }
});

export const decorators: Addon_DecoratorFunction<any>[] = [
  StyledJsxDecorator,
  ImageDecorator,
  RouterDecorator,
  HeadManagerDecorator,
];

export const loaders: Addon_LoaderFunction = async ({ globals, parameters }) => {
  const { router, appDirectory } = parameters.nextjs ?? {};
  if (appDirectory) {
    createNavigation(router);
  } else {
    createRouter({
      locale: globals.locale,
      ...router,
    });
  }
};

export const parameters = {
  docs: {
    source: {
      excludeDecorators: true,
    },
  },
  react: {
    rootOptions: {
      onCaughtError(error: unknown) {
        if (isNextRouterError(error)) return;
        console.error(error);
      },
    },
  },
};
