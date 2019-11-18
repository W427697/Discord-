import { isNil } from 'lodash';
import { PropDefaultValue } from '@storybook/components';
import { DocgenPropDefaultValue } from './types';

export function createDefaultValue(defaultValue: DocgenPropDefaultValue): PropDefaultValue {
  if (!isNil(defaultValue)) {
    const { value } = defaultValue;

    if (!isNil(value)) {
      return {
        summary: value,
      };
    }
  }

  return null;
}
