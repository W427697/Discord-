import type { SBType, StrictArgTypes } from '@storybook/types';
import type { ArgTypesExtractor, DocgenInfo } from '@storybook/docs-tools';
import { hasDocgen, extractComponentProps } from '@storybook/docs-tools';

type Schema = { kind: string; schema: [] | object; type?: string } | string;
type MetaDocgenInfo = DocgenInfo & {
  type: string | { name: string; value: string[] };
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

    props.forEach(({ docgenInfo, propDef }) => {
      const {
        name,
        description,
        type,
        default: defaultSummary,
        required,
        tags = [],
        global,
      } = docgenInfo as MetaDocgenInfo;

      if (argTypes[name] || global) {
        return; // skip duplicate and global props
      }

      const sbType =
        section === 'props' ? convert(docgenInfo as MetaDocgenInfo) : { name: type.toString() };

      const definedTypes = sbType.value
        ? sbType.value.map((item) => item.toString()).join(' | ')
        : sbType.name;

      const descriptions = `${
        tags.length ? `${tags.map((tag) => `@${tag.name}: ${tag.text}`).join('<br>')}<br><br>` : ''
      }${description}`; // nestedTypes

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
        control: { disable: !['props', 'slots'].includes(section) },
      };
    });
  });

  return argTypes;
};

export const convert = ({ schema: schemaType }: MetaDocgenInfo) => {
  if (
    typeof schemaType === 'object' &&
    schemaType.kind === 'enum' &&
    Array.isArray(schemaType.schema)
  ) {
    const values =
      schemaType.type
        ?.split('|')
        .map((item) => item.trim())
        .filter((item) => item !== 'undefined' && item !== null) || [];

    const sbType = { name: 'enum', value: values };
    const isBoolean = values.length === 1 && values[0] === 'boolean';
    const isUnion =
      values.length > 1 && values.some((item) => !(item.startsWith('"') && item.endsWith('"')));
    if (isBoolean) return { name: 'boolean' };
    if (isUnion) return { name: 'union', value: values };

    const hasObject = values.find((item) =>
      ['object', 'Record', '[]', 'array', 'Array'].some((substring) => {
        return item.toString().includes(substring);
      })
    );
    return {
      ...sbType,
      name: hasObject ? 'array' : 'enum',
      value: hasObject ? undefined : values,
    };
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
      value: [props],
    };
  }
  return { name: schemaType };
};
