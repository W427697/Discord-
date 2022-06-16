import type { StrictArgTypes } from '@storybook/csf';
import type { PropDef, ArgTypesExtractor } from '@storybook/docs-tools';
import { extractProps } from './extractProps';

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (component) {
    const extracted = extractProps(component);
    if (!extracted) {
      return null;
    }
    const { rows } = extracted;
    if (rows) {
      return rows.reduce((acc: StrictArgTypes, row: PropDef) => {
        const {
          name,
          description,
          type,
          sbType,
          defaultValue: defaultSummary,
          jsDocTags,
          required,
        } = row;

        acc[name] = {
          name,
          description,
          type: { required, ...sbType },
          table: {
            type,
            jsDocTags,
            defaultValue: defaultSummary,
          },
        };
        return acc;
      }, {});
    }
  }

  return null;
};
