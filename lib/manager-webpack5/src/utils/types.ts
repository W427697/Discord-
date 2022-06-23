import type { Ref } from '@storybook/core-common';

export interface ManagerWebpackOptions {
  entries: string[];
  refs: Record<string, Ref>;
}
