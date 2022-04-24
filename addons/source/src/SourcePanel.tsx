import React, { FC } from 'react';
import { useCurrentStory } from '@storybook/api';
import { SourceContainer } from './SourceContainer';
import { Source } from './Source';

export const SourcePanel: FC = () => {
  const story = useCurrentStory();
  return <SourceContainer>{story ? <Source id={story.id} /> : null}</SourceContainer>;
};
