import type {
  SBEnumType,
  SBObjectType,
  SBScalarType,
  SBType,
  StrictArgTypes,
} from '@storybook/types';
import type { ArgTypesExtractor, DocgenInfo } from '@storybook/docs-tools';
import { hasDocgen, extractComponentProps } from '@storybook/docs-tools';

type Schema = { kind: string; schema: [] | object; type?: string } | string;
type MetaDocgenInfo = DocgenInfo & {
  type: string;
  default: string;
  global: boolean;
  name: string;
  schema: Schema;
  tags: { name: string; text: string }[];
};

const ARG_TYPE_SECTIONS = ['props', 'events', 'slots', 'exposed'];

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (!hasDocgen(component)) {
    return null;
  }

  const argTypes: StrictArgTypes = {};

  ARG_TYPE_SECTIONS.forEach((section) => {
    const props = extractComponentProps(component, section);

    props.forEach(({ docgenInfo }) => {
      const {
        name,
        type,
        description,
        default: defaultSummary,
        required,
        tags = [],
        global,
      } = docgenInfo as MetaDocgenInfo;

      if (argTypes[name] || global) {
        return; // skip duplicate and global props
      }

      const sbType = section === 'props' ? convert(docgenInfo as MetaDocgenInfo) : { name: 'void' };
      const nestedTypes =
        sbType.name === 'object' && section === 'props' ? nestedInfo(sbType as SBObjectType) : '';
      const definedTypes = `${type.replace(' | undefined', '')}`;
      const descriptions = `${
        tags.length ? `${tags.map((tag) => `@${tag.name}: ${tag.text}`).join('<br>')}<br><br>` : ''
      }${description} ${nestedTypes} `;

      argTypes[name] = {
        name,
        description: descriptions.replace('undefined', ''),
        defaultValue: { summary: defaultSummary },
        type: { required, ...sbType } as SBType,
        table: {
          type: { summary: definedTypes },
          jsDocTags: tags,
          defaultValue: { summary: defaultSummary },
          category: section,
        },
      };
    });
  });

  return argTypes;
};

export const convert = ({ schema: schemaType }: MetaDocgenInfo): SBType => {
  if (typeof schemaType !== 'object') {
    return { name: schemaType } as SBScalarType;
  }
  if (
    typeof schemaType === 'object' &&
    schemaType.kind === 'enum' &&
    Array.isArray(schemaType.schema)
  ) {
    const values = schemaType.schema
      .filter((item) => item !== 'undefined' && item !== null)
      .map((item) => (typeof item === 'string' ? item.replace(/"/g, '') : item));

    const sbType: SBType = { name: 'enum', value: values };
    const stringIndex = values.indexOf('string');
    const numberIndex = values.indexOf('number');
    const booleanIndex = values.indexOf('boolean');
    if (stringIndex !== -1 || numberIndex !== -1 || booleanIndex !== -1) {
      const typeName = values[stringIndex ?? numberIndex ?? booleanIndex];
      return { ...sbType, name: typeName, value: undefined } as SBScalarType;
    }
    const hasObject = values.find((item) => typeof item === 'object');

    return {
      ...sbType,
      name: hasObject ? 'array' : 'enum',
      value: hasObject ? undefined : values,
    } as SBEnumType;
  }
  if (
    typeof schemaType === 'object' &&
    schemaType.kind === 'object' &&
    typeof schemaType.schema === 'object'
  ) {
    const schemaObject = schemaType.schema as { [key: string]: MetaDocgenInfo };
    const props = Object.fromEntries(
      Object.entries(schemaObject).map(([key, value]) => {
        return [key, value as MetaDocgenInfo];
      })
    );
    return {
      name: 'object',
      value: props,
    } as SBObjectType;
  }
  return { name: schemaType } as unknown as SBType;
};

function nestedInfo(sbType: SBObjectType) {
  return Object.keys(sbType.value)
    .map((key) => {
      const value = sbType.value[key] as MetaDocgenInfo;
      return `
    •${key}: ${value.type} ${value.description}
      `;
    })
    .join('<br>');
}
