import { readMetadata } from './storyMetadataReader';
import { renderFakePackageJsonFile } from './fakePackageJsonGenerator';
import { renderBootstrapCode } from './bootstrapperScriptGenerator';
import { PACKAGE_JSON, FAKE_PREFIX, BOOTSTRAPPER_JS } from './paths';

export function buildEditionState({
  source,
  mainFileLocation,
  dependencies,
  idsToFrameworks,
  localDependencies,
  story,
  kind,
}) {
  return {
    ...readMetadata({
      idsToFrameworks,
      dependencies,
      story,
      kind,
    }),
    files: {
      ...Object.assign(
        {},
        ...Object.entries(localDependencies || {}).map(([file, code]) => ({
          [`${FAKE_PREFIX}${file}`]: code,
        }))
      ),
      [`${FAKE_PREFIX}${mainFileLocation}`]: { code: source },
      [`${FAKE_PREFIX}${BOOTSTRAPPER_JS}`]: {
        code: renderBootstrapCode({ mainFileLocation, idsToFrameworks, story, kind }),
      },
      [PACKAGE_JSON]: {
        code: renderFakePackageJsonFile({
          source,
          mainFileLocation,
          dependencies,
          idsToFrameworks,
          localDependencies,
          story,
          kind,
        }),
      },
    },
  };
}
