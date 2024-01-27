import type { SBType, StrictArgTypes } from '@storybook/types';

import {
  hasDocgen,
  extractComponentProps,
  type ArgTypesExtractor,
  type DocgenInfo,
} from '@storybook/docs-tools';

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

  

  ARG_TYPE_SECTIONS.forEach((section) => {

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

      console.log('docgenInfo', docgenInfo);
      if (argTypes[name] || global) {
        return; // skip duplicate and global props
      }

      const sbType =
        section === 'props' ? convert(docgenInfo as MetaDocgenInfo) : { name: type?.toString() };

      const definedTypes = `${(type ? type.name || type.toString() : ' ').replace(
        ' | undefined',
        ''
      )}`;

      const descriptions = `${
        tags.length
          ? `${tags
              .map((tag: { name: any; text: any }) => `@${tag.name}: ${tag.text}`)
              .join('<br>')}<br><br>`
          : ''
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
    const values: string[] =
      schemaType.schema
        .filter(
          (item: Schema) =>
            item !== 'undefined' &&
            ((item !== null && typeof item === 'object' && item.kind !== 'array') ||
              typeof item === 'string')
        )
        .map((item: Schema) => (typeof item !== 'string' ? item.schema.toString() : item))
        .map((item: string) => item.replace(/'/g, '"')) || [];

    const isSingle = values.length === 1;
    const isBoolean =
      values.length === 2 && values.every((item: string) => item === 'true' || item === 'false');
    const isLateralUnion =
      values.length > 1 &&
      values.every((item: string) => item.startsWith('"') && item.endsWith('"'));
    const isEnum =
      values.length > 1 &&
      values.every(
        (item: string) => !item.startsWith('"') && typeof item === 'string' && item.includes('.')
      );

    const sbType = { name: 'enum', value: values.map((item: string) => item.replace(/"/g, '')) };
    if (isSingle) return { name: values[0] };
    if (isBoolean) return { ...sbType, name: 'boolean' };
    if (isLateralUnion || isEnum) return { ...sbType, name: 'enum' };

    return {
      name: values.length ? values[0] : 'array',
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
      value: props,
    };
  }
  return { name: schemaType };
};
