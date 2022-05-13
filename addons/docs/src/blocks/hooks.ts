import { useEffect, useState, useCallback } from 'react';
import Events from '@storybook/core-events';
import type { Args, Globals } from '@storybook/csf';
import { addons } from '@storybook/addons';

import { DocsContextProps } from './DocsContext';

const getContext = (storyId: string, context: DocsContextProps) => {
  const story = context.storyById(storyId);
  if (!story) {
    throw new Error(`Unknown story: ${storyId}`);
  }
  return context.getStoryContext(story);
};

export const useArgs = (
  storyId: string,
  context: DocsContextProps
): [Args, (args: Args) => void, (argNames?: string[]) => void] => {
  const channel = addons.getChannel();

  const storyContext = getContext(storyId, context);
  const [args, setArgs] = useState(storyContext.args);
  useEffect(() => {
    const cb = (changed: { storyId: string; args: Args }) => {
      if (changed.storyId === storyId) {
        setArgs(changed.args);
      }
    };
    channel.on(Events.STORY_ARGS_UPDATED, cb);
    return () => channel.off(Events.STORY_ARGS_UPDATED, cb);
  }, [storyId]);
  const updateArgs = useCallback(
    (updatedArgs) => channel.emit(Events.UPDATE_STORY_ARGS, { storyId, updatedArgs }),
    [storyId]
  );
  const resetArgs = useCallback(
    (argNames?: string[]) => channel.emit(Events.RESET_STORY_ARGS, { storyId, argNames }),
    [storyId]
  );
  return [args, updateArgs, resetArgs];
};

export const useGlobals = (storyId: string, context: DocsContextProps): [Globals] => {
  const channel = addons.getChannel();

  // FIXME
  const storyContext = getContext(storyId, context);
  const [globals, setGlobals] = useState(storyContext.globals);

  useEffect(() => {
    const cb = (changed: { globals: Globals }) => {
      setGlobals(changed.globals);
    };
    channel.on(Events.GLOBALS_UPDATED, cb);
    return () => channel.off(Events.GLOBALS_UPDATED, cb);
  }, []);

  return [globals];
};
