import { renderBootstrapCode } from './bootstrapperScriptGenerator';
import { renderFakePackageJsonFile } from './fakePackageJsonGenerator';
import { BOOTSTRAPPER_JS } from './paths';

export function getSource(
  { localDependencies, mainFileLocation, source, idsToFrameworks, story, kind },
  path
) {
  if (path === mainFileLocation) return source;
  if (path === BOOTSTRAPPER_JS)
    return renderBootstrapCode({ mainFileLocation, idsToFrameworks, story, kind });
  if (path === '/package.json')
    return renderFakePackageJsonFile({
      localDependencies,
      mainFileLocation,
      source,
      idsToFrameworks,
      story,
      kind,
    });
  return ((localDependencies || {})[path] || { code: '' }).code;
}
