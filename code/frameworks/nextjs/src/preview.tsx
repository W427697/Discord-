import type { Addon_DecoratorFunction } from '@storybook/types';
import './config/preview';
import { ImageDecorator } from './images/decorator';
import { RouterDecorator } from './routing/decorator';
import { StyledJsxDecorator } from './styledJsx/decorator';
import { HeadManagerDecorator } from './head-manager/decorator';
// We need this import to be a singleton, and because it's used in multiple entrypoints
// both in ESM and CJS, importing it via the package name instead of having a local import
// is the only way to achieve it actually being a singleton
import { cookies, headers } from '@storybook/nextjs/headers';

function addNextHeadCount() {
  const meta = document.createElement('meta');
  meta.name = 'next-head-count';
  meta.content = '0';
  document.head.appendChild(meta);
}

addNextHeadCount();

export const decorators: Addon_DecoratorFunction<any>[] = [
  StyledJsxDecorator,
  ImageDecorator,
  RouterDecorator,
  HeadManagerDecorator,
];

export const loaders = async () => {
  cookies().mockRestore();
  headers().mockRestore();
};

export const parameters = {
  docs: {
    source: {
      excludeDecorators: true,
    },
  },
};
