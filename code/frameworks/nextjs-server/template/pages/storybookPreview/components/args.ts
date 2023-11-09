import type { Args } from '@storybook/react';
import { useCallback, useEffect, useState } from 'react';

const _args: Record<string, Args> = {};
const _setArgs: Set<(storyId: string, newArgs: Args) => void> = new Set();

export const useArgs = (storyId: string) => {
  const [args, setAllArgs] = useState(_args);

  const setArgs = useCallback(
    (storyId: string, args: Args) => {
      setAllArgs((prev) => ({ ...prev, [storyId]: args }));
    },
    [setAllArgs]
  );

  useEffect(() => {
    _setArgs.add(setArgs);
    return () => {
      _setArgs.delete(setArgs);
    };
  }, [setArgs]);

  return args[storyId];
};

export const setArgs = (storyId: string, args: Args) => {
  console.log('setArgs', storyId, args, _setArgs.size);
  _setArgs.forEach((setter) => setter(storyId, args));
};
