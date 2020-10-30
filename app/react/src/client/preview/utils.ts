// TODO: add client-api as dependency
import { defaultDecorateStory, combineParameters } from '@storybook/client-api';
import { GlobalConfig, Meta, Story, StoryContext } from './types-6-0';

export function composeStory<GenericArgs>(
  meta: Meta,
  story: Story<GenericArgs>,
  globalConfig: GlobalConfig = {}
): Story<GenericArgs> {
  const combinedDecorators = [
    ...(globalConfig?.decorators || []),
    ...(meta?.decorators || []),
    ...(story.decorators || story.story?.decorators || []),
  ];

  const finalStoryFn = (context: StoryContext) => {
    const { passArgsFirst = true } = context.parameters;
    return passArgsFirst ? story(context.args as GenericArgs, context) : story(context);
  };

  const decorated = defaultDecorateStory(finalStoryFn, combinedDecorators);

  // TODO: figure out a type for extraArgs and mismatch with StoryContext and StoryIdentifier
  return (extraArgs: any) => {
    return decorated({
      globals: globalConfig.globalTypes,
      parameters: combineParameters(
        globalConfig.parameters || {},
        meta.parameters || {},
        story.parameters || {}
      ),
      args: {
        ...meta.args,
        ...story.args,
        ...extraArgs,
      },
    });
  };
}
