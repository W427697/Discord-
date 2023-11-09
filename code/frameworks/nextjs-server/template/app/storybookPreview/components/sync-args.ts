import type { Args } from '@storybook/react';

const args: Record<string, Args> = {};

export function getArgs(storyId: string): Args {
  return args[storyId] || {};
}

export function setArgs(storyId: string, newArgs: any) {
  args[storyId] = newArgs;
}
