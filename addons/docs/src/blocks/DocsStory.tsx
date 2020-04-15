import React, { FunctionComponent } from 'react';
import { Subheading } from './Subheading';
import { DocsStoryProps } from './types';
import { Anchor } from './Anchor';
import { Description } from './Description';
import { Story } from './Story';
import { Preview, SourceState } from './Preview';

type PreviewProps = {
  withToolbar?: boolean;
  withSource?: SourceState;
};

export const DocsStory: FunctionComponent<DocsStoryProps> = ({
  id,
  name,
  expanded = true,
  withToolbar = false,
  parameters,
}) => {
  const previewProps: PreviewProps = {
    withToolbar,
  };
  if (parameters && parameters.docs && parameters.docs.previewSource) {
    previewProps.withSource = parameters.docs.previewSource;
  }
  return (
    <Anchor storyId={id}>
      {expanded && <Subheading>{name}</Subheading>}
      {expanded && parameters && parameters.docs && parameters.docs.storyDescription && (
        <Description markdown={parameters.docs.storyDescription} />
      )}
      <Preview {...previewProps}>
        <Story id={id} />
      </Preview>
    </Anchor>
  );
};
