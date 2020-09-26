import { PropType } from '@storybook/components';
import { DocgenFlowType } from '../types';
import { createSummaryValue, isTooLongForTypeSummary, isUnsafeToSplit } from '../../utils';

enum FlowTypesType {
  UNION = 'union',
  INTERSECTION = 'intersection',
  SIGNATURE = 'signature',
  LITERAL = 'literal',
  ARRAY = 'Array',
}

interface FlowTypeObjectParameters {
  key: string | DocgenFlowType;
  value: DocgenFlowType;
}

interface FlowTypeFunctionArguments {
  name?: string;
  type: DocgenFlowType;
}

function getSummary({ raw, type, name }: DocgenFlowType) {
  if (raw == null || isTooLongForTypeSummary(raw)) {
    return type || name;
  }

  return raw.replace(/^\|\s*/, '');
}

function generateObjectDetail({ signature, raw }: DocgenFlowType): string {
  if (!signature) {
    return raw || '{}';
  }

  const { constructor, properties = [] } = signature;
  const generatedProperties = properties.map(({ key, value }: FlowTypeObjectParameters) => {
    let propKey = key;
    if (typeof key !== 'string') {
      propKey = `[${generateDetail(key)}]`;
    }
    const requiredness = value.required === false ? '?' : '';
    return `${propKey}${requiredness}: ${generateDetail(value)}`;
  });

  // The constructor property is different than other signatures so we just use the raw value
  if (constructor && constructor.raw) {
    generatedProperties.unshift(constructor.raw);
  }

  return generatedProperties.length ? `{ ${generatedProperties.join(', ')} }` : '{}';
}

function generateFuncDetail({ signature, raw }: DocgenFlowType): string {
  if (!signature) {
    return raw || '() => void';
  }

  const { arguments: argumentsValues = [], return: returnValue = { name: 'void' } } = signature;
  const generatedArguments = argumentsValues.map(({ name, type }: FlowTypeFunctionArguments) => {
    return name ? `${name}: ${generateDetail(type)}` : generateDetail(type);
  });

  return `(${generatedArguments.join(', ')}) => ${generateDetail(returnValue)}`;
}

function generateArrayDetail({ elements }: DocgenFlowType): string {
  if (!Array.isArray(elements) || elements.length === 0) {
    return '';
  }

  return `Array<${elements.map(generateDetail).join(' | ')}>`;
}

function generateDetail(flowType: DocgenFlowType): string | null {
  const { name, type, value, raw, elements = [] } = flowType;

  switch (name) {
    case FlowTypesType.LITERAL:
      return value;
    case FlowTypesType.UNION:
      return elements.map(generateDetail).join(' | ');
    case FlowTypesType.INTERSECTION:
      return elements.map(generateDetail).join(' & ');
    case FlowTypesType.SIGNATURE:
      return type === 'object' ? generateObjectDetail(flowType) : generateFuncDetail(flowType);
    case FlowTypesType.ARRAY:
      return generateArrayDetail(flowType);
    default:
      return raw || type || name;
  }
}

export function createType(flowType: DocgenFlowType): PropType {
  // A type could be null if a defaultProp has been provided without a type definition.
  if (flowType == null) {
    return null;
  }

  const summary = getSummary(flowType);
  const detail = generateDetail(flowType);

  if (!detail) {
    return createSummaryValue(summary);
  }

  switch (flowType.name) {
    case FlowTypesType.UNION:
      return isUnsafeToSplit(detail)
        ? createSummaryValue(summary, detail)
        : createSummaryValue(detail);
    case FlowTypesType.SIGNATURE:
    case FlowTypesType.ARRAY:
      return isTooLongForTypeSummary(detail)
        ? createSummaryValue(summary, detail)
        : createSummaryValue(detail);
    default:
      return createSummaryValue(detail);
  }
}
