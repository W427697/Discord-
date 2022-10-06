import { writeFile, ensureFile } from 'fs-extra';
import { join } from 'path';
import { compilation } from '../index';

export async function readOrderedFiles(addonsDir: string) {
  const files = await Promise.all(
    compilation?.outputFiles?.map(async (file) => {
      // convert deeply nested paths to a single level, also remove special characters
      const filePath = file.path
        .replace(addonsDir, '')
        .replace(/[^a-z0-9\-.]+/g, '-')
        .replace(/^-/, '/');
      const location = join(addonsDir, filePath);
      const url = `./sb-addons${filePath}`;

      await ensureFile(location).then(() => writeFile(location, file.contents));
      return url;
    }) || []
  );

  const jsFiles = files.filter((file) => file.endsWith('.mjs'));
  const cssFiles = files.filter((file) => file.endsWith('.css'));
  return { cssFiles, jsFiles };
}
