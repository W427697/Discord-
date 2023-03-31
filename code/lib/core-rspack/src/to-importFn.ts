import { logger } from '@storybook/node-logger';

import path from 'path';

/**
 * Paths get passed either with no leading './' - e.g. `src/Foo.stories.js`,
 * or with a leading `../` (etc), e.g. `../src/Foo.stories.js`.
 * We want to deal in importPaths relative to the working dir, so we normalize
 */
function toImportPath(relativePath: string) {
  return relativePath.startsWith('../') ? relativePath : `./${relativePath}`;
}

/**
 * This function takes an array of stories and creates a mapping between the stories' relative paths
 * to the working directory and their dynamic imports. The import is done in an asynchronous function
 * to delay loading. It then creates a function, `importFn(path)`, which resolves a path to an import
 * function and this is called by Storybook to fetch a story dynamically when needed.
 * @param stories An array of absolute story paths.
 */
export async function toImportFn(stories: string[]) {
  const objectEntries = stories.map((file) => {
    const ext = path.extname(file);
    const relativePath = path.relative(process.cwd(), file);
    if (!['.js', '.jsx', '.ts', '.tsx', '.mdx'].includes(ext)) {
      logger.warn(`Cannot process ${ext} file with storyStoreV7: ${relativePath}`);
    }

    return `  '${toImportPath(relativePath)}': async () => import('${file}')`;
  });

  return `
    const importers = {
      ${objectEntries.join(',\n')}
    };

    export async function importFn(path) {
        return importers[path]();
    }
  `;
}
