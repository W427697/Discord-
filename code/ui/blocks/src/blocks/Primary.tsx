import type { FC } from 'react';
import React from 'react';
import type { Of } from './useOf';
import { useOf } from './useOf';
import { DocsStory } from './DocsStory';

interface PrimaryProps {
  /**
   * Specify where to get the primary story from.
   */
  of?: Of;
}

export const Primary: FC<PrimaryProps> = (props) => {
  const { of } = props;
  if ('of' in props && of === undefined) {
    throw new Error('Unexpected `of={undefined}`, did you mistype a CSF file reference?');
  }

  const { stories } = useOf(of || 'meta', ['meta']).csfFile;
  const primaryStory = Object.values(stories ?? {})[0];

  return primaryStory ? (
    <DocsStory of={primaryStory.moduleExport} expanded={false} __primary withToolbar />
  ) : null;
};
