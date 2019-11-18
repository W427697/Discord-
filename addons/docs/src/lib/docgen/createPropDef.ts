import { isNil } from 'lodash';
import { PropDef } from '@storybook/components';
import { TypeSystem, DocgenInfo, DocgenType } from './types';
import { JsDocParsingResult } from '../jsdocParser';
import { createDefaultValue } from './createDefaultValue';

export interface PropDefFactoryProps {
  name: string;
  defaultPropValue: any;
  docgenInfo: DocgenInfo;
  jsDocParsingResult?: JsDocParsingResult;
}

export type PropDefFactory = (props: PropDefFactoryProps) => PropDef;

export interface CreatePropDefProp extends PropDefFactoryProps {
  type: DocgenType;
}

function createBasicPropDef({
  name,
  defaultPropValue,
  type,
  docgenInfo,
}: Omit<CreatePropDefProp, 'jsDocParsingResult'>): PropDef {
  const { description, required, defaultValue } = docgenInfo;
  const defaults = defaultValue || { value: defaultPropValue };

  return {
    name,
    type: { summary: type.name },
    required,
    description,
    defaultValue: createDefaultValue(defaults),
  };
}

function createPropDef({
  name,
  defaultPropValue,
  type,
  docgenInfo,
  jsDocParsingResult,
}: CreatePropDefProp): PropDef {
  const propDef = createBasicPropDef({ name, defaultPropValue, type, docgenInfo });

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

export const javaScriptFactory: PropDefFactory = (props: PropDefFactoryProps) => {
  return createPropDef({ ...props, type: props.docgenInfo.type });
};

export const tsFactory: PropDefFactory = (props: PropDefFactoryProps) => {
  return createPropDef({ ...props, type: props.docgenInfo.tsType });
};

export const flowFactory: PropDefFactory = (props: PropDefFactoryProps) => {
  return createPropDef({ ...props, type: props.docgenInfo.flowType });
};

export const unknownFactory: PropDefFactory = (props: PropDefFactoryProps) => {
  return createPropDef({ ...props, type: { name: 'unknown' } });
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
