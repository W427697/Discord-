import { useAddonState } from '@storybook/api';
import { ADDON_NAME } from './constants';

export const useEditor = () => {
  const [addonState, setAddonState] = useAddonState(ADDON_NAME, {});

  const setAddonStateFunc = (newSource: string, storyId: string) => {
    setAddonState({
      ...addonState,
      [storyId]: newSource,
    });
  };

  return [addonState, setAddonStateFunc] as [
    Record<string, string>,
    (newSource: string, storyId: string) => void
  ];
};
