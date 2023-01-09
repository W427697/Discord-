import type { ModuleExport, ResolvedModuleExport } from 'lib/types/src';
import { useContext } from 'react';
import { DocsContext } from './DocsContext';

export const useOf = (
  of?: ModuleExport,
  validTypes: ResolvedModuleExport['type'][] = []
): ResolvedModuleExport => {
  const context = useContext(DocsContext);
  const resolved = context.resolveModuleExport(of);

  if (validTypes.length && !validTypes.includes(resolved.type)) {
    const prettyType = resolved.type === 'component' ? 'component or unknown' : resolved.type;
    throw new Error(
      `Invalid value passed to the 'of' prop. The value was resolved to a '${prettyType}' type but the only types for this block are: ${validTypes.join(
        ', '
      )}`
    );
  }
  return resolved;
};
