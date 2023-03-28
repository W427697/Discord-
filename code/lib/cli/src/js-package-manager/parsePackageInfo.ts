import sort from 'semver/functions/sort';

const parsePackageData = (packageName = '') => {
  const [first, second, third] = packageName.trim().split('@');
  const version = (third || second).replace('npm:', '');
  const name = third ? `@${second}` : first;

  const value = { version, location: '' };
  return { name, value };
};

type Yarn1ListItem = {
  name: string;
  children: Yarn1ListItem[];
};

type Yarn1ListData = {
  type: 'list';
  trees: Yarn1ListItem[];
};

export type Yarn1ListOutput = {
  type: 'tree';
  data: Yarn1ListData;
};

type PnpmDependency = {
  from: string;
  version: string;
  resolved: string;
  dependencies?: PnpmDependencies;
};

type PnpmDependencies = {
  [key: string]: PnpmDependency;
};

type PnpmListItem = {
  dependencies: PnpmDependencies;
  peerDependencies: PnpmDependencies;
  devDependencies: PnpmDependencies;
};

export type PnpmListOutput = PnpmListItem[];

type NpmDependency = {
  version: string;
  resolved?: string;
  overridden?: boolean;
  dependencies?: NpmDependencies;
};

type NpmDependencies = {
  [key: string]: NpmDependency;
};

export type NpmListOutput = {
  dependencies: NpmDependencies;
};

type PackageMetadata = { version: string; location?: string; reasons?: string[] };
export type InstallationMetadata = {
  dependencies: Record<string, PackageMetadata[]>;
  duplicatedDependencies: Record<string, string[]>;
  infoCommand: string;
};

export const mapDependenciesNpm = (input: NpmListOutput): InstallationMetadata => {
  const acc: Record<string, PackageMetadata[]> = {};
  const existingVersions: Record<string, string[]> = {};
  const duplicatedDependencies: Record<string, string[]> = {};

  const recurse = ([name, packageInfo]: [string, NpmDependency]): void => {
    if (!name || !name.includes('storybook')) return;

    const value = {
      version: packageInfo.version,
      location: '',
    };

    if (!existingVersions[name]?.includes(value.version)) {
      if (acc[name]) {
        acc[name].push(value);
      } else {
        acc[name] = [value];
      }
      existingVersions[name] = sort([...(existingVersions[name] || []), value.version]);

      if (existingVersions[name].length > 1) {
        duplicatedDependencies[name] = existingVersions[name];
      }
    }

    if (packageInfo.dependencies) {
      Object.entries(packageInfo.dependencies).forEach(recurse);
    }
  };

  Object.entries(input.dependencies).forEach(recurse);

  return {
    dependencies: acc,
    duplicatedDependencies,
    infoCommand: 'npm ls --depth=1',
  };
};

export const mapDependenciesPnpm = (input: PnpmListOutput): InstallationMetadata => {
  const acc: Record<string, PackageMetadata[]> = {};
  const existingVersions: Record<string, string[]> = {};
  const duplicatedDependencies: Record<string, string[]> = {};
  const items: PnpmDependencies = input.reduce((curr, item) => {
    const { devDependencies, dependencies, peerDependencies } = item;
    const allDependencies = { ...devDependencies, ...dependencies, ...peerDependencies };
    return Object.assign(curr, allDependencies);
  }, {} as PnpmDependencies);

  const recurse = ([name, packageInfo]: [string, PnpmDependency]): void => {
    if (!name || !name.includes('storybook')) return;

    const value = {
      version: packageInfo.version,
      location: '',
    };

    if (!existingVersions[name]?.includes(value.version)) {
      if (acc[name]) {
        acc[name].push(value);
      } else {
        acc[name] = [value];
      }
      existingVersions[name] = [...(existingVersions[name] || []), value.version];

      if (existingVersions[name].length > 1) {
        duplicatedDependencies[name] = existingVersions[name];
      }
    }

    if (packageInfo.dependencies) {
      Object.entries(packageInfo.dependencies).forEach(recurse);
    }
  };
  Object.entries(items).forEach(recurse);

  return {
    dependencies: acc,
    duplicatedDependencies,
    infoCommand: 'pnpm list --depth=1',
  };
};

export const mapDependenciesYarn2 = (input: string): InstallationMetadata => {
  const lines = input.split('\n');
  const acc: Record<string, PackageMetadata[]> = {};
  const existingVersions: Record<string, string[]> = {};
  const duplicatedDependencies: Record<string, string[]> = {};

  lines.forEach((packageName) => {
    if (!packageName || !packageName.includes('storybook')) {
      return;
    }

    const { name, value } = parsePackageData(packageName.replaceAll(`"`, ''));
    if (!existingVersions[name]?.includes(value.version)) {
      if (acc[name]) {
        acc[name].push(value);
      } else {
        acc[name] = [value];
      }

      existingVersions[name] = [...(existingVersions[name] || []), value.version];
      if (existingVersions[name].length > 1) {
        duplicatedDependencies[name] = existingVersions[name];
      }
    }
  });

  return {
    dependencies: acc,
    duplicatedDependencies,
    infoCommand: 'yarn why',
  };
};

export const mapDependenciesYarn1 = (input: Yarn1ListOutput): InstallationMetadata => {
  if (input.type === 'tree') {
    const { trees } = input.data;
    const acc: Record<string, PackageMetadata[]> = {};
    const existingVersions: Record<string, string[]> = {};
    const duplicatedDependencies: Record<string, string[]> = {};

    const recurse = (tree: typeof trees[0]) => {
      const { children } = tree;
      const { name, value } = parsePackageData(tree.name);
      if (!name || !name.includes('storybook')) return;
      if (!existingVersions[name]?.includes(value.version)) {
        if (acc[name]) {
          acc[name].push(value);
        } else {
          acc[name] = [value];
        }
        existingVersions[name] = [...(existingVersions[name] || []), value.version];

        if (existingVersions[name].length > 1) {
          duplicatedDependencies[name] = existingVersions[name];
        }
      }

      children.forEach(recurse);
    };

    trees.forEach(recurse);

    return {
      dependencies: acc,
      duplicatedDependencies,
      infoCommand: 'yarn why',
    };
  }

  throw new Error('Something went wrong while parsing yarn output');
};
