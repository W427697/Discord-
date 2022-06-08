import dedent from 'ts-dedent';

import type { NormalizedStoriesSpecifier } from '../types';
import { globToRegexp } from './glob-to-regexp';

export function webpackIncludeRegexp(specifier: NormalizedStoriesSpecifier) {
  const { directory, files } = specifier;

  // It appears webpack passes *something* similar to the absolute path to the file
  // on disk (prefixed with something unknown) to the matcher.
  // We don't want to include the absolute path in our bundle, so we will just pull any leading
  // `./` or `../` off our directory and match on that.
  // It's imperfect as it could match extra things in extremely unusual cases, but it'll do for now.
  // NOTE: directory is "slashed" so will contain only `/` (no `\`), even on windows
  const directoryWithoutLeadingDots = directory.replace(/^(\.+\/)+/, '/');
  const webpackIncludeGlob = ['.', '..'].includes(directory)
    ? files
    : `${directoryWithoutLeadingDots}/${files}`;
  const webpackIncludeRegexpWithCaret = globToRegexp(webpackIncludeGlob);
  // picomatch is creating an exact match, but we are only matching the end of the filename
  return new RegExp(webpackIncludeRegexpWithCaret.source.replace(/^\^/, ''));
}

export function toImportFnPart(specifier: NormalizedStoriesSpecifier) {
  const { directory, importPathMatcher } = specifier;

  return dedent`
      async (path) => {
        if (!${importPathMatcher}.exec(path)) {
          return;
        }

        const pathRemainder = path.substring(${directory.length + 1});
        return import(
          /* webpackChunkName: "[request]" */
          /* webpackInclude: ${webpackIncludeRegexp(specifier)} */
          '${directory}/' + pathRemainder
        );
      }

  `;
}

export function toImportFn(
  stories: NormalizedStoriesSpecifier[],
  { needPipelinedImport }: { needPipelinedImport?: boolean } = {}
) {
  let pipelinedImport = `const pipelineImport = (x) => x;`;
  if (needPipelinedImport) {
    // If an import is in flight when another import arrives, block it until the first completes.
    // This is to avoid a situation where webpack kicks off a second compilation whilst the
    // first is still completing, cf: https://github.com/webpack/webpack/issues/15541#issuecomment-1143138832
    // Note the way this code works if N futher `import()`s occur while the first is in flight,
    // they will all be kicked off in the same tick and not block each other. This is by design,
    // Webpack can handle multiple invalidations simutaneously, just not in quick succession.
    pipelinedImport = dedent`
      let importGate = Promise.resolve();
      async function pipelineImport(anImport) {
        await importGate;
        
        const moduleExportsPromise = anImport();
        importGate = importGate.then(() => moduleExportsPromise);
        return moduleExportsPromise;
      }
    `;
  }

  return dedent`
    ${pipelinedImport}

    const importers = [
      ${stories.map(toImportFnPart).join(',\n')}
    ];

    export async function importFn(path) {
      for (let i = 0; i < importers.length; i++) {
        const moduleExports = await pipelineImport(() => importers[i](path));
        if (moduleExports) {
          return moduleExports;
        }
      }
    }
  `;
}
