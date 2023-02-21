import type { FC } from 'react';
import React, { useContext } from 'react';
import { DocsContext } from './DocsContext';
import { DocsStory } from './DocsStory';
import { Heading } from './Heading';

interface StoriesProps {
  title?: JSX.Element | string;
  includePrimary?: boolean;
  ignoreWhenOnlyPrimary?: boolean;
}

export const Stories: FC<StoriesProps> = ({
  title,
  includePrimary = true,
  ignoreWhenOnlyPrimary = true,
}) => {
  const { componentStories } = useContext(DocsContext);

  let stories = componentStories().filter((story) => !story.parameters?.docs?.disable);

  if (ignoreWhenOnlyPrimary && stories.length <= 1) {
    return null;
  }

  if (!includePrimary) stories = stories.slice(1);

  if (!stories || stories.length === 0) {
    return null;
  }
  return (
    <>
      <Heading>{title}</Heading>
      {stories.map(
        (story) =>
          story && <DocsStory key={story.id} of={story.moduleExport} expanded __forceInitialArgs />
      )}
    </>
  );
};

Stories.defaultProps = {
  title: 'Stories',
};
