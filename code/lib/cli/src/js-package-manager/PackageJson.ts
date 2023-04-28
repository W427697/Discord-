import type { PackageJson } from '@junk-temporary-prototypes/types';

export type { PackageJson } from '@junk-temporary-prototypes/types';
export type PackageJsonWithDepsAndDevDeps = PackageJson &
  Required<Pick<PackageJson, 'dependencies' | 'devDependencies'>>;

export type PackageJsonWithMaybeDeps = Partial<
  Pick<PackageJson, 'dependencies' | 'devDependencies' | 'peerDependencies' | 'files'>
>;
