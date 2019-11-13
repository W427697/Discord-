import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';
import { parseJsDoc, ExtractedJsDocTags, ExtractedJsDocParamTag } from './jsdoc-parser';
import { DocgenInfo } from './DocgenInfo';

export const TypeSystem = {
  Flow: 'Flow',
  TypeScript: 'TypeScript',
  PropTypes: 'PropTypes',
  Unknown: 'Unknown',
};

export interface TypeSystemHandlerResult {
  propDef?: PropDef;
  ignore: boolean;
}

export type TypeSystemHandler = (params: {
  propName: string;
  defaultPropValue?: any;
  docgenInfo: DocgenInfo;
}) => TypeSystemHandlerResult;

interface HandlePropResult extends TypeSystemHandlerResult {
  extractedJsDocTags?: ExtractedJsDocTags;
}

function createDefaultPropDef(params: {
  propName: string;
  defaultPropValue?: any;
  propType: {
    name: string;
  };
  docgenInfo: DocgenInfo;
}): PropDef {
  const {
    propName,
    defaultPropValue,
    propType,
    docgenInfo: { description, required, defaultValue },
  } = params;
  const defaults = defaultValue || { value: defaultPropValue };

  return {
    name: propName,
    type: propType,
    required,
    description,
    defaultValue: isNil(defaults) ? null : defaults.value,
  };
}

function propMightContainsJsDoc(docgenInfo: DocgenInfo): boolean {
  return !isNil(docgenInfo.description) && docgenInfo.description.includes('@');
}

function handleProp(params: {
  propName: string;
  defaultPropValue: any;
  propType: {
    name: string;
  };
  docgenInfo: DocgenInfo;
}): HandlePropResult {
  const { docgenInfo } = params;
  const propDef = createDefaultPropDef(params);

  if (propMightContainsJsDoc(docgenInfo)) {
    const { ignore, description, extractedTags } = parseJsDoc(docgenInfo);

    if (ignore) {
      return {
        ignore: true,
      };
    }

    if (!isNil(description)) {
      propDef.description = description;
    }

    const hasParams = !isNil(extractedTags.params);
    const hasReturns = !isNil(extractedTags.returns) && !isNil(extractedTags.returns.type);

    if (hasParams || hasReturns) {
      propDef.jsDocTags = {
        params: hasParams && extractedTags.params.map(x => x.raw),
        returns: hasReturns && extractedTags.returns.raw,
      };

      return {
        propDef,
        extractedJsDocTags: extractedTags,
        ignore: false,
      };
    }
  }

  return {
    propDef,
    ignore: false,
  };
}

export const propTypesHandler: TypeSystemHandler = ({ propName, docgenInfo, defaultPropValue }) => {
  const result = handleProp({ propName, propType: docgenInfo.type, docgenInfo, defaultPropValue });

  if (!result.ignore) {
    const { propDef, extractedJsDocTags } = result;

    // When available use the proper JSDoc tags to describe the function signature instead of displaying "func".
    if (propDef.type.name === 'func') {
      if (!isNil(extractedJsDocTags)) {
        const hasParams = !isNil(extractedJsDocTags.params);
        const hasReturns = !isNil(extractedJsDocTags.returns);

        if (hasParams || hasReturns) {
          const funcParts = [];

          if (hasParams) {
            const funcParams = extractedJsDocTags.params.map((x: ExtractedJsDocParamTag) => {
              const prettyName = x.getPrettyName();
              const typeName = x.getTypeName();

              if (!isNil(typeName)) {
                return `${prettyName}: ${typeName}`;
              }

              return prettyName;
            });

            funcParts.push(`(${funcParams.join(', ')})`);
          } else {
            funcParts.push('()');
          }

          if (hasReturns) {
            funcParts.push(`=> ${extractedJsDocTags.returns.getTypeName()}`);
          }

          propDef.type = {
            name: funcParts.join(' '),
          };
        }
      }
    }
  }

  return result;
};

export const tsHandler: TypeSystemHandler = ({ propName, docgenInfo, defaultPropValue }) => {
  return handleProp({ propName, propType: docgenInfo.tsType, docgenInfo, defaultPropValue });
};

export const flowHandler: TypeSystemHandler = ({ propName, docgenInfo, defaultPropValue }) => {
  return handleProp({ propName, propType: docgenInfo.flowType, docgenInfo, defaultPropValue });
};

export const unknownHandler: TypeSystemHandler = ({ propName, docgenInfo, defaultPropValue }) => {
  return handleProp({ propName, propType: { name: 'unknown' }, docgenInfo, defaultPropValue });
};

export const TypeSystemHandlers: Record<string, TypeSystemHandler> = {
  [TypeSystem.Flow]: flowHandler,
  [TypeSystem.TypeScript]: tsHandler,
  [TypeSystem.PropTypes]: propTypesHandler,
  [TypeSystem.Unknown]: unknownHandler,
};

export const getPropTypeSystem = (docgenInfo: DocgenInfo): string => {
  if (!isNil(docgenInfo.flowType)) {
    return TypeSystem.Flow;
  }

  if (!isNil(docgenInfo.tsType)) {
    return TypeSystem.TypeScript;
  }

  if (!isNil(docgenInfo.type)) {
    return TypeSystem.PropTypes;
  }

  return TypeSystem.Unknown;
};

export const getTypeSystemHandler = (typeSystem: string): TypeSystemHandler => {
  return TypeSystemHandlers[typeSystem];
};
