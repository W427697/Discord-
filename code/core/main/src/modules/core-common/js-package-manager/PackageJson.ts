import type { PackageJson } from '@storybook/core/dist/modules/types/index';

export type { PackageJson } from '@storybook/core/dist/modules/types/index';
export type PackageJsonWithDepsAndDevDeps = PackageJson &
  Required<Pick<PackageJson, 'dependencies' | 'devDependencies'>>;

export type PackageJsonWithMaybeDeps = Partial<
  Pick<PackageJson, 'dependencies' | 'devDependencies' | 'peerDependencies' | 'files'>
>;
