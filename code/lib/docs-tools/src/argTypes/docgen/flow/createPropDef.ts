// eslint-disable-next-line import/no-cycle
import { PropDefFactory } from '../createPropDef';
// eslint-disable-next-line import/no-cycle
import { createType } from './createType';
// eslint-disable-next-line import/no-cycle
import { createDefaultValue } from './createDefaultValue';

export const createFlowPropDef: PropDefFactory = (propName, docgenInfo) => {
  const { flowType, description, required, defaultValue } = docgenInfo;

  return {
    name: propName,
    type: createType(flowType),
    required,
    description,
    defaultValue: createDefaultValue(defaultValue, flowType),
  };
};
