import { Story } from '@storybook/store';
import { SourceType } from '../shared';
import { enhanceSource } from './enhanceSource';

export const getSnippet = (snippet: string, story?: Story<any>): string => {
  if (!story) {
    return snippet;
  }

  const { parameters } = story;
  // eslint-disable-next-line no-underscore-dangle
  const isArgsStory = parameters.__isArgsStory;
  const type = parameters.docs?.source?.type || SourceType.AUTO;

  // if user has hard-coded the snippet, that takes precedence
  const userCode = parameters.docs?.source?.code;
  if (userCode !== undefined) {
    return userCode;
  }

  // if user has explicitly set this as dynamic, use snippet
  if (type === SourceType.DYNAMIC) {
    return parameters.docs?.transformSource?.(snippet, story) || snippet;
  }

  // if this is an args story and there's a snippet
  if (type === SourceType.AUTO && snippet && isArgsStory) {
    return parameters.docs?.transformSource?.(snippet, story) || snippet;
  }

  // otherwise, use the source code logic
  const enhanced = enhanceSource(story) || parameters;
  return enhanced?.docs?.source?.code || '';
};
