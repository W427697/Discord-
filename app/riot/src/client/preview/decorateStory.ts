import type {DecoratorFunction, StoryContext, LegacyStoryFn} from '@storybook/csf';
import {RiotComponent} from 'riot'
import {sanitizeStoryContextUpdate} from '@storybook/store';

import type {RiotFramework} from './types-6-0';
import {StoryFnRiotReturnType} from './types'

function prepare(
  rawStory: RiotFramework['storyResult'],
  innerStory?: StoryFnRiotReturnType
): StoryFnRiotReturnType | null {
  const story = rawStory as Partial<RiotComponent>;

  if (story == null) {
    return null;
  }

  if (innerStory) {
    return {
      components: {
        ...(story.components || {}),
        story: innerStory
      },
      template: story.template
    };
  }

  return {
    template: story
  };
}

export function decorateStory(
  storyFn: LegacyStoryFn<RiotFramework>,
  decorators: DecoratorFunction<RiotFramework>[]
): LegacyStoryFn<RiotFramework> {
  return decorators.reduce(
    (decorated: LegacyStoryFn<RiotFramework>, decorator) => (context: StoryContext<RiotFramework>) => {
      let story: RiotFramework['storyResult'];

      const decoratedStory: RiotFramework['storyResult'] = decorator((update) => {
        story = decorated({...context, ...sanitizeStoryContextUpdate(update)});
        return story;
      }, context);

      if (!story) {
        story = decorated(context);
      }

      if (decoratedStory === story) {
        return story;
      }

      return prepare(decoratedStory, story) as RiotFramework['storyResult'];
    },
    (context) => prepare(storyFn(context)) as LegacyStoryFn<RiotFramework>
  );
}
