import type { StrictArgTypes } from '@junk-temporary-prototypes/types';
import type { PropDef, ArgTypesExtractor } from '@junk-temporary-prototypes/docs-tools';
import { extractProps } from './extractProps';

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (component) {
    const { rows } = extractProps(component);
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
