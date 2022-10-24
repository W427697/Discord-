import { PropDefaultValue } from '../PropDef';
import { DocgenInfo } from '../types';
// eslint-disable-next-line import/no-cycle
import { createSummaryValue } from '../../utils';
import { isDefaultValueBlacklisted } from '../utils/defaultValue';

export function createDefaultValue({ defaultValue }: DocgenInfo): PropDefaultValue {
  if (defaultValue != null) {
    const { value } = defaultValue;

    if (!isDefaultValueBlacklisted(value)) {
      return createSummaryValue(value);
    }
  }

  return null;
}
