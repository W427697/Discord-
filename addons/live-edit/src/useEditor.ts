import { useAddonState } from '@storybook/api';
import { formatter } from '@storybook/components/dist/syntaxhighlighter/formatter';
import { ADDON_NAME } from './constants';

export const useEditor = () => {
  const [addonState, setAddonState] = useAddonState(ADDON_NAME, {});

  const setAddonStateFunc = (newSource: string, storyId: string) => {
    setAddonState({
      ...addonState,
      [storyId]: newSource.trimLeft(),
    });
  };

  return [addonState, setAddonStateFunc] as [
    Record<string, string>,
    (newSource: string, storyId: string) => void
  ];
};
