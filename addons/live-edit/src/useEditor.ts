import { useStoryState } from '@storybook/api';
import { ADDON_NAME } from './constants';

export const useEditor = () => {
  const [addonState, setAddonState] = useStoryState(ADDON_NAME, '');

  const setAddonStateFunc = (newSource: string) => {
    setAddonState(newSource.trimLeft());
  };

  return [addonState, setAddonStateFunc] as [string, (newSource: string) => void];
};
