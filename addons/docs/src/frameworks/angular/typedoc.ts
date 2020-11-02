import { ArgTypes } from '@storybook/addons';
import { logger } from '@storybook/client-logger';
import { JSONOutput } from 'typedoc';
import { Component, Directive } from './types';

let typedocJson: JSONOutput.ProjectReflection;

export function setTypedocJson(typedocConfig: object) {
  assertTypedocJson(typedocConfig);
  typedocJson = typedocConfig;
}
export function getTypedocJson() {
  return typedocJson;
}

export function assertTypedocJson(
  typedocConfig: object
): asserts typedocConfig is JSONOutput.ProjectReflection {
  if (
    typedocConfig &&
    'id' in typedocConfig &&
    'kind' in typedocConfig &&
    'name' in typedocConfig &&
    'flags' in typedocConfig
  ) {
    return;
  }

  throw new Error('Invalid typedoc configuation.');
}

export function assertDirective(directive: Function): asserts directive is Component | Directive {
  if (!directive.name) {
    throw new Error(`Invalid directive ${directive}.`);
  }
}

const cache = new Map<string, JSONOutput.DeclarationReflection>();
function findReflectionByProperty(
  key: keyof JSONOutput.DeclarationReflection,
  value: unknown,
  reflection: JSONOutput.DeclarationReflection = typedocJson
): JSONOutput.DeclarationReflection | null {
  if (reflection[key] === value) {
    return reflection;
  }

  if (!reflection.children) {
    return null;
  }

  const memoized = cache.get(key + value);

  if (memoized) {
    return memoized;
  }

  for (let i = 0; i < reflection.children.length; i += 1) {
    const found = findReflectionByProperty(key, value, reflection.children[i]);

    if (found !== null) {
      cache.set(key + value, found);
      return found;
    }
  }

  return null;
}
const findReflectionByName = (name: string) => findReflectionByProperty('name', name);
const findReflectionById = (id: number) => findReflectionByProperty('id', id);

function getReflectionData(
  component: Component | Directive
): JSONOutput.DeclarationReflection | null {
  if (!component) {
    return null;
  }

  assertDirective(component);

  const { name } = component;
  const metadata = findReflectionByName(name);

  if (metadata === null) {
    logger.warn(`${name} not found in typedoc JSON.`);
  }

  return metadata;
}

const isUnionType = (typedocType: JSONOutput.SomeType): typedocType is JSONOutput.UnionType =>
  typedocType.type === 'union';
const isIntrinsicType = (
  typedocType: JSONOutput.SomeType
): typedocType is JSONOutput.IntrinsicType => typedocType.type === 'intrinsic';
const isReferenceType = (
  typedocType: JSONOutput.SomeType
): typedocType is JSONOutput.ReferenceType => typedocType.type === 'reference';
const isArrayType = (typedocType: JSONOutput.SomeType): typedocType is JSONOutput.ArrayType =>
  typedocType.type === 'array';
function extractType(
  reflection: JSONOutput.DeclarationReflection
): { name: string; value?: unknown } {
  const typedocType = reflection?.type;

  if (reflection.kindString === 'Accessor') {
    return extractType(reflection.setSignature[0].parameters![0]);
  }

  if (!typedocType) {
    return { name: null };
  }

  if (isUnionType(typedocType)) {
    return {
      name: 'enum',
      value: typedocType.types.map((type: JSONOutput.StringLiteralType) => type.value),
    };
  }

  if (isIntrinsicType(typedocType)) {
    return typedocType;
  }

  if (isReferenceType(typedocType)) {
    return extractType(findReflectionById(typedocType.id));
  }

  if (isArrayType(typedocType)) {
    return { name: `${(typedocType.elementType as any).name}[]` };
  }

  return { name: 'string' };
}

function coerceDefaultValue(value: string) {
  switch (value) {
    case 'false':
      return false;
    case 'true':
      return true;
    default:
  }

  return value?.split('"').join('');
}

const isInput = (reflection: JSONOutput.DeclarationReflection) =>
  reflection.decorators?.some((d) => d.name === 'Input');
function mapReflectionToTableCategory(reflection: JSONOutput.DeclarationReflection) {
  if (reflection.kindString === 'Property' || reflection.kindString === 'Accessor') {
    if (!reflection.decorators) {
      return 'properties';
    }

    const angularDecorators = <const>[
      'Input',
      'Output',
      'ViewChild',
      'ViewChildren',
      'ContentChild',
      'ContentChildren',
    ];
    const sections: Record<typeof angularDecorators[number], string> = {
      Input: 'inputs',
      Output: 'outputs',
      ViewChild: 'view child',
      ViewChildren: 'view children',
      ContentChild: 'content child',
      ContentChildren: 'content children',
    };

    const decorator = reflection.decorators
      .map((d) => d.name)
      .find((name: typeof angularDecorators[number]): name is typeof angularDecorators[number] =>
        angularDecorators.includes(name)
      );

    if (decorator) {
      return sections[decorator];
    }

    return 'properties';
  }

  if (reflection.kindString === 'Method') {
    return 'methods';
  }

  return '';
}

function extractArgTypesFromReflection(
  componentReflaction: JSONOutput.DeclarationReflection
): ArgTypes {
  return componentReflaction.children.reduce<ArgTypes>(
    (argTypes, reflection: JSONOutput.DeclarationReflection) => {
      return {
        ...argTypes,
        [reflection.name]: {
          name: reflection.name,
          description:
            reflection.comment?.shortText ?? reflection.signatures?.[0].comment?.shortText,
          defaultValue: coerceDefaultValue(
            (reflection as JSONOutput.ParameterReflection).defaultValue
          ),
          type: isInput(reflection) ? extractType(reflection) : { name: 'void' },
          table: {
            category: mapReflectionToTableCategory(reflection),
            type: {
              // TODO: Should split the extractType to two functions, one providing rendering type and another readable type
              // e.g. Union as enum rendered type and TS union representation for readable type.
              summary: (reflection as any).type?.name ?? extractType(reflection).name,
              required: !reflection.flags.isOptional,
            },
          },
        },
      };
    },
    {}
  );
}

export function extractArgTypes(component: Component | Directive): ArgTypes {
  const reflection = getReflectionData(component);

  if (reflection === null) {
    return null;
  }

  return extractArgTypesFromReflection(reflection);
}

export function extractComponentDescription(component: Component | Directive) {
  const reflection = getReflectionData(component);
  const comment = reflection?.comment;
  const shortText = comment?.shortText ?? '';
  const text = comment?.text ?? '';

  return `${shortText}\n\n${text}`;
}
