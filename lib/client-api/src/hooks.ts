import { ADDON_STATE_CHANGED, ADDON_STATE_SET, STORY_CHANGED } from '@storybook/core-events';

import {
  addons,
  HooksContext,
  applyHooks,
  useMemo,
  useCallback,
  useRef,
  useState,
  useReducer,
  useEffect,
  useChannel,
  useStoryContext,
  useParameter,
} from '@storybook/addons';

export {
  HooksContext,
  applyHooks,
  useMemo,
  useCallback,
  useRef,
  useState,
  useReducer,
  useEffect,
  useChannel,
  useStoryContext,
  useParameter,
};

export function useAddonState<S>(addonId: string, defaultState?: S): [S, (s: S) => void] {
  const channel = addons.getChannel();

  const [lastValue] =
    channel.last(`${ADDON_STATE_CHANGED}-manager-${addonId}`) ||
    channel.last(`${ADDON_STATE_SET}-manager-${addonId}`) ||
    [];

  const [state, setState] = useState<S>(lastValue || defaultState);

  const allListeners = useMemo(
    () => ({
      [`${ADDON_STATE_CHANGED}-manager-${addonId}`]: (s: S) => setState(s),
      [`${ADDON_STATE_SET}-manager-${addonId}`]: (s: S) => setState(s),
    }),
    [addonId]
  );

  const emit = useChannel(allListeners, [addonId]);

  useEffect(() => {
    // init
    if (defaultState !== undefined && !lastValue) {
      emit(`${ADDON_STATE_SET}-client-${addonId}`, defaultState);
    }
  }, [addonId]);

  return [
    state,
    s => {
      setState(s);
      emit(`${ADDON_STATE_CHANGED}-client-${addonId}`, s);
    },
  ];
}

export function useStoryId(): string {
  const channel = addons.getChannel();
  const [lastValue] = channel.last(STORY_CHANGED) || [];
  return lastValue;
}

export function useStoryState<S>(prefix = 'global', defaultState: S) {
  const storyId = useStoryId();
  const [state, setState] = useAddonState(`${prefix}${storyId}`, defaultState);
  return [state, setState] as [S, (newState: S) => void];
}
