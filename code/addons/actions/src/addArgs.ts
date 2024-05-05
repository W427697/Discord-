import type { ArgsEnhancer } from '@storybook/core/dist/types';
import { addActionsFromArgTypes, inferActionsFromArgTypesRegex } from './addArgsHelpers';

export const argsEnhancers: ArgsEnhancer[] = [
  addActionsFromArgTypes,
  inferActionsFromArgTypesRegex,
];
