import type { PackageJson } from '@storybook/types';

export function hasChromatic(packageJson: PackageJson) {
  if (
    packageJson.dependencies?.chromatic ||
    packageJson.devDependencies?.chromatic ||
    packageJson.peerDependencies?.chromatic
  ) {
    return true;
  }

  // Chromatic isn't necessarily installed in dependencies, it can be run from npx
  return !!(
    packageJson.scripts && Object.values(packageJson.scripts).find((s) => s.match(/chromatic/))
  );
}
