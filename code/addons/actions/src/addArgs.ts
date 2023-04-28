import type { ArgsEnhancer } from '@junk-temporary-prototypes/types';
import { addActionsFromArgTypes, inferActionsFromArgTypesRegex } from './addArgsHelpers';

export const argsEnhancers: ArgsEnhancer[] = [
  addActionsFromArgTypes,
  inferActionsFromArgTypesRegex,
];
