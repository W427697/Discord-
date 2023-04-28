import type { StrictArgTypes } from '@junk-temporary-prototypes/types';
import type { ArgTypesExtractor } from '@junk-temporary-prototypes/docs-tools';
import { hasDocgen, extractComponentProps, convert } from '@junk-temporary-prototypes/docs-tools';

const SECTIONS = ['props', 'events', 'slots', 'methods'];

export const extractArgTypes: ArgTypesExtractor = (component) => {
  if (!hasDocgen(component)) {
    return null;
  }
  const results: StrictArgTypes = {};
  SECTIONS.forEach((section) => {
    const props = extractComponentProps(component, section);
    props.forEach(({ propDef, docgenInfo, jsDocTags }) => {
      const { name, type, description, defaultValue: defaultSummary, required } = propDef;
      const sbType = section === 'props' ? convert(docgenInfo) : { name: 'void' };

      results[name] = {
        name,
        description,
        type: { required, ...sbType },
        table: {
          type,
          jsDocTags,
          defaultValue: defaultSummary,
          category: section,
        },
      };
    });
  });
  return results;
};
