import { addons, useEffect } from '@storybook/core/dist/preview-api';
import { PartialStoryFn } from '@storybook/core/dist/types';
import { SNIPPET_RENDERED, SourceType } from '@storybook/core/dist/docs-tools';
import { StoryContext, AngularRenderer } from '../types';
import { computesTemplateSourceFromComponent } from '../../renderer';

export const skipSourceRender = (context: StoryContext) => {
  const sourceParams = context?.parameters.docs?.source;

  // always render if the user forces it
  if (sourceParams?.type === SourceType.DYNAMIC) {
    return false;
  }
  // never render if the user is forcing the block to render code, or
  // if the user provides code
  return sourceParams?.code || sourceParams?.type === SourceType.CODE;
};

/**
 * Angular source decorator.
 * @param storyFn Fn
 * @param context  StoryContext
 */
export const sourceDecorator = (
  storyFn: PartialStoryFn<AngularRenderer>,
  context: StoryContext
) => {
  const story = storyFn();
  if (skipSourceRender(context)) {
    return story;
  }
  const channel = addons.getChannel();
  const { props, template, userDefinedTemplate } = story;

  const { component, argTypes } = context;

  let toEmit: string;

  useEffect(() => {
    if (toEmit) {
      const { id, unmappedArgs } = context;
      channel.emit(SNIPPET_RENDERED, { id, args: unmappedArgs, source: toEmit, format: 'angular' });
    }
  });

  if (component && !userDefinedTemplate) {
    const source = computesTemplateSourceFromComponent(component, props, argTypes);

    // We might have a story with a Directive or Service defined as the component
    // In these cases there might exist a template, even if we aren't able to create source from component
    if (source || template) {
      toEmit = source || template;
    }
  } else if (template) {
    toEmit = template;
  }

  return story;
};
