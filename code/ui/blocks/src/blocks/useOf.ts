import type {
  DocsContextProps,
  NormalizedProjectAnnotations,
  ResolvedModuleExport,
} from 'lib/types/src';
import { useContext } from 'react';
import { DocsContext } from './DocsContext';

export type Of = Parameters<DocsContextProps['resolveModuleExport']>[0];

/**
 * A hook to resolve the `of` prop passed to a block.
 * will return the resolved module as well as project annotations
 * project annotations are handy because if the resolved module is a meta,
 * it will be the meta as-is from the CSF file, and it won't inherit the global annotations.
 */
export const useOf = (
  of: Of,
  validTypes: ResolvedModuleExport['type'][] = []
): ReturnType<typeof resolveOfProp> => {
  const context = useContext(DocsContext);
  return resolveOfProp({ context, of, validTypes });
};

type ResolveOfPropParams = {
  context: DocsContextProps;
  of: Of;
  validTypes?: ResolvedModuleExport['type'][];
};
export const resolveOfProp = ({
  context,
  of,
  validTypes = [],
}: ResolveOfPropParams): ResolvedModuleExport & {
  projectAnnotations: NormalizedProjectAnnotations;
} => {
  const resolved = context.resolveModuleExport(of);

  if (validTypes.length && !validTypes.includes(resolved.type)) {
    const prettyType = resolved.type === 'component' ? 'component or unknown' : resolved.type;
    throw new Error(
      `Invalid value passed to the 'of' prop. The value was resolved to a '${prettyType}' type but the only types for this block are: ${validTypes.join(
        ', '
      )}`
    );
  }
  return { ...resolved, projectAnnotations: context.projectAnnotations };
};
