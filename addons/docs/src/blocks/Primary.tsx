import React, { useContext, FC } from 'react';
import { DocsContext } from './DocsContext';
import { DocsStory } from './DocsStory';
import { getDocsStories } from './utils';

interface PrimaryProps {
  name?: string;
}

export const Primary: FC<PrimaryProps> = ({ name }) => {
  const context = useContext(DocsContext);
  const componentStories = getDocsStories(context);
  if (!componentStories || componentStories.length === 0) return null;
  const story = name ? componentStories.find(s => s.name === name) : componentStories[0];
  return <DocsStory {...story} expanded withToolbar />;
};
