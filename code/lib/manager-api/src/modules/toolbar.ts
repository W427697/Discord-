import { FORCE_REMOUNT } from '@storybook/core-events';
import type { ModuleFn } from '../index';

export interface SubState {
  remount: { isAnimating: boolean };
}

export interface SubAPI {
  remount: () => void;
  remountEnd: () => void;
}

export const init: ModuleFn = ({ store, fullAPI }) => {
  const api: SubAPI = {
    remount: () => {
      const { storyId, remount } = store.getState();
      if (!storyId) return;
      store.setState({ remount: { ...remount, isAnimating: true } });
      fullAPI.emit(FORCE_REMOUNT, { storyId });
    },
    remountEnd: () => {
      const { remount } = store.getState();
      store.setState({ remount: { ...remount, isAnimating: false } });
    },
  };

  const state: SubState = { remount: { isAnimating: false } };

  return { api, state };
};
