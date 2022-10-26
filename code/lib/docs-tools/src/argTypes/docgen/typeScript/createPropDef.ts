// eslint-disable-next-line import/no-cycle
import { PropDefFactory } from '../createPropDef';
// eslint-disable-next-line import/no-cycle
import { createType } from './createType';
// eslint-disable-next-line import/no-cycle
import { createDefaultValue } from './createDefaultValue';

export const createTsPropDef: PropDefFactory = (propName, docgenInfo) => {
  const { description, required } = docgenInfo;

  return {
    name: propName,
    type: createType(docgenInfo),
    required,
    description,
    defaultValue: createDefaultValue(docgenInfo),
  };
};
