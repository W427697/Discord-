import * as React from 'react';
import semver from 'semver';
import type { Addon_DecoratorFunction } from '@storybook/types';
import type { StoryContext } from './types';

export const ServerComponentDecorator = (
  Story: React.FC,
  { parameters }: StoryContext
): React.ReactNode => {
  if (!parameters?.react?.rsc) return <Story />;

  if (semver.major(React.version) < 18 || semver.minor(React.version) < 3) {
    throw new Error('React Server Components require React 18.3');
  }

  return (
    <React.Suspense>
      <Story />
    </React.Suspense>
  );
};

export const decorators: Addon_DecoratorFunction<any>[] = [ServerComponentDecorator];

export const parameters = {
  react: {
    rsc: true,
  },
};
