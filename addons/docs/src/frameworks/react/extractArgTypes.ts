import { StrictArgTypes } from '@storybook/csf';
import { PropDef, ArgTypesExtractor, getDocgenDescription } from '../../lib/docgen';
import { extractProps } from './extractProps';

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (component) {
    const { rows } = extractProps(component);

    if (rows) {
      const jsDocDescription = getDocgenDescription(component);
      const returnValue = jsDocDescription
        ? {
            __description: {
              name: 'Component Description',
              jsDocDescription,
            },
          }
        : {};

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
      }, returnValue);
    }
  }

  return null;
};
