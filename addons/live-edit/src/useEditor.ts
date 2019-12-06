// @ts-ignore
import { useAddonState, useCurrentStory } from '@storybook/api';
import { ADDON_NAME } from './constants';

export const useEditor = () => {
  const story = useCurrentStory();
  const storyId = story && story.id ? story.id : '*';
  const [addonState, setAddonState] = useAddonState(ADDON_NAME, {
    [storyId]: '',
  });

  const setAddonStateFunc = (newSource: string) => {
    setAddonState({
      ...addonState,
      [storyId]: newSource,
    });
  };

  return [addonState[storyId], setAddonStateFunc] as [string, (newSource: string) => void];
};
