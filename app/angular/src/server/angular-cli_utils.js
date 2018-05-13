import fs from 'fs';
import { basename, dirname, normalize, relative, resolve } from '@angular-devkit/core';

export function isBuildAngularInstalled() {
  try {
    require.resolve('@angular-devkit/build-angular');
    return true;
  } catch (e) {
    return false;
  }
}

export function isDirectory(assetPath) {
  try {
    return fs.statSync(assetPath).isDirectory();
  } catch (_) {
    return false;
  }
}

export function normalizeAssetPatterns(assetPatterns, dirToSearch, sourceRoot) {
  if (!assetPatterns || !assetPatterns.length) {
    return [];
  }

  return assetPatterns.map(assetPattern => {
    let glob;
    let input;
    const assetPath = normalize(assetPattern);
    const resolvedSourceRoot = resolve(dirToSearch, sourceRoot);
    const resolvedAssetPath = resolve(dirToSearch, assetPath);

    // logger.info(`=> ${resolvedAssetPath}`);
    if (isDirectory(resolvedAssetPath)) {
      // Folders get a recursive star glob.
      glob = '**/*';
      // Input directory is their original path.
      input = assetPath;
    } else {
      // Files are their own glob.
      glob = basename(assetPath);
      // Input directory is their original dirname.
      input = dirname(assetPath);
    }

    // Output directory for both is the relative path from source root to input.
    const output = relative(resolvedSourceRoot, resolve(dirToSearch, input));

    // Return the asset pattern in object format.
    return {
      glob,
      input,
      output,
    };
  });
}
