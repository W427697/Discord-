import type { FC } from 'react';
import React from 'react';
import { Subheading } from './Subheading';
import type { DocsStoryProps } from './types';
import { Anchor } from './Anchor';
import { Description } from './Description';
import { Canvas } from './Canvas';
import { useOf } from './useOf';

export const DocsStory: FC<DocsStoryProps> = ({
  of,
  expanded = true,
  withToolbar = false,
  __forceInitialArgs = false,
  __primary = false,
}) => {
  const { story } = useOf(of || 'story', ['story']);
  const description = story.parameters?.docs?.description?.story;

  return (
    <Anchor storyId={story.id}>
      {expanded && (
        <>
          <Subheading>{story.name}</Subheading>
          {description !== undefined && <Description markdown={description} />}
        </>
      )}
      <Canvas of={of} withToolbar={withToolbar} story={{ __forceInitialArgs, __primary }} />
    </Anchor>
  );
};
