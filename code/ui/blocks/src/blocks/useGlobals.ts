import type { Globals } from '@storybook/csf';
import type { DocsContextProps, PreparedStory } from '@storybook/core/dist/types';
import { useEffect, useState } from 'react';
import { GLOBALS_UPDATED } from '@storybook/core/dist/core-events';

export const useGlobals = (story: PreparedStory, context: DocsContextProps): [Globals] => {
  const storyContext = context.getStoryContext(story);

  const [globals, setGlobals] = useState(storyContext.globals);
  useEffect(() => {
    const onGlobalsUpdated = (changed: { globals: Globals }) => {
      setGlobals(changed.globals);
    };
    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, [context.channel]);

  return [globals];
};
