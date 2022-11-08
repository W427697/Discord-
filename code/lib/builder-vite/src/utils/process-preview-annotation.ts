import { resolve } from 'path';

/**
 * Preview annotations can take several forms, and vite needs them to be a bit more restrained.
 * For node_modules, we want bare imports (so vite can process them), and for files in the user's source,
 * we want absolute paths.
 */
export function processPreviewAnnotation(path: string | string[] | undefined) {
  // If entry is a tuple, take the first, which is the non-absolute path.
  // This is so that webpack can use an absolute path (the second item in the tuple), and
  // continue supporting super-addons in pnp/pnpm without requiring them to re-export their
  // sub-addons as we do in addon-essentials.
  if (Array.isArray(path)) {
    return path[0];
  }
  // resolve relative paths into absolute paths, but don't resolve "bare" imports
  if (path?.startsWith('./') || path?.startsWith('../')) {
    return resolve(path);
  }
  return path;
}
