/* eslint-disable react/display-name */
import React from 'react';
import { toId } from '@storybook/csf';
import { composeStories, composeStory } from '@storybook/react/testing-api';

export const indexStories = (stories: any) => {
  const composed = composeStories(stories);
  const { title } = stories.default;
  const index = Object.fromEntries(
    Object.entries(composed).map(([key, val]) => [toId(title, key), val])
  );
  return index;
};

export const parseParam = (param: string) => {
  if (param === 'true') return true;
  if (param === 'false') return false;
  return param;
};

export const indexStory = (key: string, csfExports: any): React.ElementType => {
  const Composed = composeStory(csfExports[key], csfExports.default);
  return (props) => {
    const parsed = Object.fromEntries(
      Object.entries(props).map(([name, value]: [string, any]) => [name, parseParam(value)])
    );
    console.log({ props, parsed });
    return <Composed {...parsed} />;
  };
};
