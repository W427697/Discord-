import dedent from 'ts-dedent';
import type { NormalizedStoriesSpecifier } from '@storybook/types';

export function toImportFnPart(specifier: NormalizedStoriesSpecifier) {
  const { directory, importPathMatcher } = specifier;

  return dedent`
      async (path) => {
        if (!${importPathMatcher}.exec(path)) {
          return;
        }

        const pathRemainder = path.substring(${directory.length + 1});

        return import(
          '${directory}/' + pathRemainder
        );
      }

  `;
}

export function toImportFn(stories: NormalizedStoriesSpecifier[]) {
  const pipelinedImport = `const pipeline = (x) => x();`;

  console.log({ stories });

  return dedent`
    ${pipelinedImport}

    const importers = [
      ${stories.map(toImportFnPart).join(',\n')}
    ];

    export async function importFn(path) {
      for (let i = 0; i < importers.length; i++) {
        const moduleExports = await pipeline(() => importers[i](path));
        if (moduleExports) {
          return moduleExports;
        }
      }
    }
  `;
}
