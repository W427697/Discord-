import type { FC, ReactElement } from 'react';
import React, { useContext } from 'react';
import { styled } from '@storybook/theming';
import { DocsContext } from './DocsContext';
import { DocsStory } from './DocsStory';
import { Heading } from './Heading';
import type { Of } from './useOf';
import { useOf } from './useOf';

interface StoriesProps {
  title?: ReactElement | string;
  includePrimary?: boolean;
  /**
   * Specify where to get the stories from.
   */
  of?: Of;
}

const StyledHeading: typeof Heading = styled(Heading)(({ theme }) => ({
  fontSize: `${theme.typography.size.s2 - 1}px`,
  fontWeight: theme.typography.weight.bold,
  lineHeight: '16px',
  letterSpacing: '0.35em',
  textTransform: 'uppercase',
  color: theme.textMutedColor,
  border: 0,
  marginBottom: '12px',

  '&:first-of-type': {
    // specificity issue
    marginTop: '56px',
  },
}));

export const Stories: FC<StoriesProps> = (props = { title: 'Stories', includePrimary: true }) => {
  const { of } = props;

  if ('of' in props && of === undefined) {
    throw new Error('Unexpected `of={undefined}`, did you mistype a CSF file reference?');
  }
  const { componentStories, projectAnnotations, getStoryContext } = useContext(DocsContext);

  let stories = componentStories();
  const { stories: { filter } = { filter: undefined } } = projectAnnotations.parameters?.docs || {};
  if (filter) {
    stories = stories.filter((story) => filter(story, getStoryContext(story)));
  }
  // NOTE: this should be part of the default filter function. However, there is currently
  // no way to distinguish a Stories block in an autodocs page from Stories in an MDX file
  // making https://github.com/storybookjs/storybook/pull/26634 an unintentional breaking change.
  //
  // The new behavior here is that if NONE of the stories in the autodocs page are tagged
  // with 'autodocs', we show all stories. If ANY of the stories have autodocs then we use
  // the new behavior.
  const hasAutodocsTaggedStory = stories.some((story) => story.tags?.includes('autodocs'));
  if (hasAutodocsTaggedStory) {
    stories = stories.filter((story) => story.tags?.includes('autodocs'));
  }

  const { preparedMeta } = useOf(of || 'meta', ['meta']);

  const title = props.title ?? preparedMeta.parameters.docs?.stories?.title;
  const includePrimary =
    props.includePrimary ?? preparedMeta.parameters.docs?.stories?.includePrimary;

  if (!includePrimary) stories = stories.slice(1);

  if (!stories || stories.length === 0) {
    return null;
  }
  return (
    <>
      <StyledHeading>{title}</StyledHeading>
      {stories.map(
        (story) =>
          story && <DocsStory key={story.id} of={story.moduleExport} expanded __forceInitialArgs />
      )}
    </>
  );
};
