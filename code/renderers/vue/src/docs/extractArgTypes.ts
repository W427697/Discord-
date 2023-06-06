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

const argTypeSections = ['props', 'events', 'slots', 'methods'];

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (!hasDocgen(component)) {
    return null;
  }
  const argTypes: StrictArgTypes = {};
  argTypeSections.forEach((section) => {
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

      const definedTypes = `${type.replace(' | undefined', '')}`;
      const descriptions = `${
        tags.length ? `${tags.map((tag) => `@${tag.name}: ${tag.text}`).join('<br>')}<br><br>` : ''
      }${description}`;

      // enalble control only for props and slots
      const control: { disable?: boolean; type?: string } = {};
      if (section !== 'props' && section !== 'slots') {
        control.disable = false;
      }
      // set control to boolean if type is boolean
      if (definedTypes === 'boolean') {
        control.type = 'boolean';
      }

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
        control,
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
    const RecordIndex = values.indexOf('Record');

    if (stringIndex !== -1 || numberIndex !== -1 || booleanIndex !== -1 || RecordIndex !== -1) {
      const typeName =
        values[
          (stringIndex + 1 || numberIndex + 1 || booleanIndex + 1 || RecordIndex + 1 || 1) - 1
        ];
      return { ...sbType, name: typeName, value: undefined } as SBScalarType;
    }
    const hasObject = values.find((item) =>
      ['object', 'Record', '[]', 'array', 'Array'].some((substring) => {
        return item.toString().includes(substring);
      })
    );
    return {
      ...sbType,
      name: hasObject ? 'array' : 'enum',
      value: hasObject ? undefined : values,
      type: hasObject ? 'array' : values.length === 2,
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
