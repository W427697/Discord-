import type {
  ComponentAnnotations,
  AnyFramework,
  LegacyStoryAnnotationsOrFn,
  StoryId,
  StoryAnnotations,
  StoryFn,
} from '@storybook/csf';
import { storyNameFromExport, toId } from '@storybook/csf';
import type { NormalizedStoryAnnotations } from '../types';
import { normalizeInputTypes } from './normalizeInputTypes';

export function normalizeStory<TFramework extends AnyFramework>(
  key: StoryId,
  storyAnnotations: LegacyStoryAnnotationsOrFn<TFramework>,
  meta: ComponentAnnotations<TFramework>
): NormalizedStoryAnnotations<TFramework> {
  let userStoryFn: StoryFn<TFramework>;
  let storyObject: StoryAnnotations<TFramework>;
  if (typeof storyAnnotations === 'function') {
    userStoryFn = storyAnnotations;
    storyObject = storyAnnotations;
  } else {
    storyObject = storyAnnotations;
  }

  const exportName = storyNameFromExport(key);
  const name =
    (typeof storyObject !== 'function' && storyObject.name) || storyObject.storyName || exportName;
  const decorators = storyObject.decorators || [];
  const { parameters } = storyObject;
  const { args } = storyObject;
  const { argTypes } = storyObject;
  const loaders = storyObject.loaders || [];
  const { render, play } = storyObject;

  // eslint-disable-next-line no-underscore-dangle
  const id = parameters.__id || toId(meta.id || meta.title, exportName);
  return {
    id,
    name,
    decorators,
    parameters,
    args,
    argTypes: normalizeInputTypes(argTypes),
    loaders,
    ...(render && { render }),
    ...(userStoryFn && { userStoryFn }),
    ...(play && { play }),
  };
}
