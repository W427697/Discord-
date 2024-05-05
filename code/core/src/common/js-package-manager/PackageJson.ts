import type { PackageJson } from '@storybook/core/dist/types';

export type PackageJsonWithDepsAndDevDeps = PackageJson &
  Required<Pick<PackageJson, 'dependencies' | 'devDependencies'>>;

export type PackageJsonWithMaybeDeps = Partial<
  Pick<PackageJson, 'dependencies' | 'devDependencies' | 'peerDependencies' | 'files'>
>;

export { PackageJson };
