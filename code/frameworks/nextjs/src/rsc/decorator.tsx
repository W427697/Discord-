import * as React from 'react';
import type { StoryContext } from '@storybook/react';

export const ServerComponentDecorator = (
  Story: React.FC,
  { parameters }: StoryContext
): React.ReactNode => {
  console.log('ServerComponentDecorator', { rsc: parameters?.nextjs?.rsc });
  return parameters?.nextjs?.rsc ? (
    <React.Suspense>
      <Story />
    </React.Suspense>
  ) : (
    <Story />
  );
};
