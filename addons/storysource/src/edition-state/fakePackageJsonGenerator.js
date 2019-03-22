import { readFrameworkOverrides } from './frameworkOverridesReader';
import { readMetadata } from './storyMetadataReader';

export function renderFakePackageJsonFile(state) {
  const { devDependencies } = readFrameworkOverrides(state);
  const { entry, name, dependenciesMapping } = readMetadata(state);
  return JSON.stringify(
    {
      name,
      main: entry,
      dependencies: dependenciesMapping,
      devDependencies: Object.assign({}, ...(devDependencies || []).map(d => ({ [d]: 'latest' }))),
    },
    null,
    4
  );
}
