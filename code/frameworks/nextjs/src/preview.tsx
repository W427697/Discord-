import type { Addon_DecoratorFunction } from '@storybook/types';
import './config/preview';
import { ServerComponentDecorator } from './rsc/decorator';
import { ImageDecorator } from './images/decorator';
import { RouterDecorator } from './routing/decorator';
import { StyledJsxDecorator } from './styledJsx/decorator';
import { HeadManagerDecorator } from './head-manager/decorator';

function addNextHeadCount() {
  const meta = document.createElement('meta');
  meta.name = 'next-head-count';
  meta.content = '0';
  document.head.appendChild(meta);
}

addNextHeadCount();

export const decorators: Addon_DecoratorFunction<any>[] = [
  ServerComponentDecorator,
  StyledJsxDecorator,
  ImageDecorator,
  RouterDecorator,
  HeadManagerDecorator,
];

export const parameters = {
  nextjs: {
    rsc: true,
  },
  docs: {
    source: {
      excludeDecorators: true,
    },
  },
};
