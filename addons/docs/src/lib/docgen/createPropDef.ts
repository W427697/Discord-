import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { TypeSystem, DocgenInfo, DocgenType } from './types';
import { JsDocParsingResult } from '../jsdocParser';
import { createDefaultValue } from './createDefaultValue';

export type PropDefFactory = (props: {
  propName: string;
  defaultPropValue: any;
  docgenInfo: DocgenInfo;
  jsDocParsingResult?: JsDocParsingResult;
}) => PropDef;

function createBasicPropDef({
  propName,
  defaultPropValue,
  type,
  docgenInfo,
}: {
  propName: string;
  defaultPropValue: any;
  docgenInfo: DocgenInfo;
  type: DocgenType;
}): PropDef {
  const { description, required, defaultValue } = docgenInfo;

  return {
    name: propName,
    type: { summary: type.name },
    required,
    description,
    defaultValue: createDefaultValue(defaultValue || { value: defaultPropValue }),
  };
}

function createPropDef({
  propName,
  defaultPropValue,
  type,
  docgenInfo,
  jsDocParsingResult,
}: {
  propName: string;
  defaultPropValue: any;
  docgenInfo: DocgenInfo;
  jsDocParsingResult?: JsDocParsingResult;
  type: DocgenType;
}): PropDef {
  const propDef = createBasicPropDef({ propName, defaultPropValue, type, docgenInfo });

  if (jsDocParsingResult.includesJsDoc) {
    const { description, extractedTags } = jsDocParsingResult;

    if (!isNil(description)) {
      propDef.description = jsDocParsingResult.description;
    }

    const hasParams = !isNil(extractedTags.params);
    const hasReturns = !isNil(extractedTags.returns) && !isNil(extractedTags.returns.type);

    if (hasParams || hasReturns) {
      propDef.jsDocTags = {
        params:
          hasParams &&
          extractedTags.params.map(x => ({ name: x.getPrettyName(), description: x.description })),
        returns: hasReturns && { description: extractedTags.returns.description },
      };
    }
  }

  return propDef;
}

export const javaScriptFactory: PropDefFactory = params => {
  return createPropDef({ ...params, type: params.docgenInfo.type });
};

export const tsFactory: PropDefFactory = params => {
  return createPropDef({ ...params, type: params.docgenInfo.tsType });
};

export const flowFactory: PropDefFactory = params => {
  return createPropDef({ ...params, type: params.docgenInfo.flowType });
};

export const unknownFactory: PropDefFactory = params => {
  return createPropDef({ ...params, type: { name: 'unknown' } });
};

export const getPropDefFactory = (typeSystem: TypeSystem): PropDefFactory => {
  switch (typeSystem) {
    case TypeSystem.JAVASCRIPT:
      return javaScriptFactory;
    case TypeSystem.TYPESCRIPT:
      return tsFactory;
    case TypeSystem.FLOW:
      return flowFactory;
    default:
      return unknownFactory;
  }
};
