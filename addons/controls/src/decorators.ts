import { useChannel, useArgs } from '@storybook/client-api';
import type { StoryFn } from '@storybook/addons';
import { CONTROL_BUTTON_CLICK } from './constants';

export const withButtonActions = (storyFn: StoryFn) => {
  const [args] = useArgs();
  useChannel({
    [CONTROL_BUTTON_CLICK]: (name: string) => {
      // FIXME: I don't have a way to enforce those values, as i don't have the arg types :(
      args[name]();
    },
  });
  return storyFn();
};
