import boxen from 'boxen';
import chalk from 'chalk';
import prompts from 'prompts';
import dedent from 'ts-dedent';
import execa from 'execa';
import { logger } from '@storybook/node-logger';
import { GenerateNewProjectOnInitError } from '@storybook/core-events/server-errors';

import type { PackageManagerName } from './js-package-manager';

type CoercedPackageManagerName = 'npm' | 'yarn' | 'pnpm';

interface SupportedProject {
  displayName: {
    type: string;
    builder?: string;
    language: string;
  };
  createScript: Record<CoercedPackageManagerName, string>;
}

/**
 * The supported projects.
 */
const SUPPORTED_PROJECTS: Record<string, SupportedProject> = {
  'react-vite-ts': {
    displayName: {
      type: 'React',
      builder: 'Vite',
      language: 'TS',
    },
    createScript: {
      npm: 'npm create vite@latest --yes . -- --template react-ts',
      yarn: 'yarn create vite@latest --yes . --template react-ts',
      pnpm: 'pnpm create vite@latest --yes . --template react-ts && pnpm i',
    },
  },
  'nextjs-ts': {
    displayName: {
      type: 'Next.js',
      language: 'TS',
    },
    createScript: {
      npm: 'npm create next-app . -- --typescript --use-npm --eslint --tailwind --no-app --import-alias="@/*" --src-dir',
      yarn: 'yarn create next-app . --typescript --use-yarn --eslint --tailwind --no-app --import-alias="@/*" --src-dir',
      pnpm: 'pnpm create next-app . --typescript --use-pnpm --eslint --tailwind --no-app --import-alias="@/*" --src-dir && pnpm i',
    },
  },
  'vue-vite-ts': {
    displayName: {
      type: 'Vue 3',
      builder: 'Vite',
      language: 'TS',
    },
    createScript: {
      npm: 'npm create vite@latest --yes . -- --template vue-ts',
      yarn: 'yarn create vite@latest --yes . --template vue-ts',
      pnpm: 'pnpm create vite@latest --yes . --template vue-ts && pnpm i',
    },
  },
  'angular-cli': {
    displayName: {
      type: 'Angular',
      language: 'TS',
    },
    createScript: {
      npm: 'npx -p @angular/cli@latest ng new angular-latest --directory . --routing=true --minimal=true --style=scss --strict --skip-git --skip-install',
      yarn: 'yarn dlx -p @angular/cli ng new angular-latest --directory . --routing=true --minimal=true --style=scss --strict --skip-git --package-manager=yarn --skip-install && touch yarn.lock && yarn set version berry && yarn config set nodeLinker node-modules',
      pnpm: 'pnpm --package @angular/cli dlx ng new angular-latest --directory . --routing=true --minimal=true --style=scss --strict --skip-git --package-manager=pnpm --skip-install && pnpm i',
    },
  },
  'lit-vite-ts': {
    displayName: {
      type: 'Lit',
      builder: 'Vite',
      language: 'TS',
    },
    createScript: {
      npm: 'npm create vite@latest --yes . -- --template lit-ts',
      yarn: 'yarn create vite . --yes --template lit-ts && touch yarn.lock && yarn set version berry && yarn config set nodeLinker pnp',
      pnpm: 'pnpm create vite@latest . --yes --template lit-ts && cd . && pnpm i',
    },
  },
};

const packageManagerToCoercedName = (
  packageManager: PackageManagerName
): CoercedPackageManagerName => {
  switch (packageManager) {
    case 'npm':
      return 'npm';
    case 'pnpm':
      return 'pnpm';
    default:
      return 'yarn';
  }
};

const buildProjectDisplayNameForPrint = ({ displayName }: SupportedProject) => {
  const { type, builder, language } = displayName;
  return `${chalk.bold.blue(type)} ${builder ? `+ ${builder} ` : ''}(${language})`;
};

/**
 * Scaffold a new project.
 *
 * @param packageManager The package manager to use.
 */
export const scaffoldNewProject = async (packageManager: PackageManagerName) => {
  const packageManagerName = packageManagerToCoercedName(packageManager);

  logger.plain(
    boxen(
      dedent`
        Would you like to generate a new project from the following list?

        ${chalk.bold('Note:')}
        Storybook supports many more frameworks and bundlers than listed below. If you don't see your
        preferred setup, you can still generate a project then rerun this command to add Storybook.

        ${chalk.bold('Press ^C at any time to quit.')}
      `,
      {
        title: chalk.bold('🔎 Empty directory detected'),
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'yellow',
      }
    )
  );

  const { project } = await prompts(
    {
      type: 'select',
      name: 'project',
      message: 'Choose a project template',
      choices: Object.entries(SUPPORTED_PROJECTS).map(([key, value]) => ({
        title: buildProjectDisplayNameForPrint(value),
        value: key,
      })),
    },
    { onCancel: () => process.exit(0) }
  );

  const projectStrategy = SUPPORTED_PROJECTS[project];
  const projectDisplayName = buildProjectDisplayNameForPrint(projectStrategy);
  const createScript = projectStrategy.createScript[packageManagerName];

  try {
    logger.plain('');
    logger.plain(
      `Creating a new "${projectDisplayName}" project with ${chalk.bold(packageManagerName)}...`
    );
    await execa.command(createScript, {
      stdio: 'pipe',
      shell: true,
      cwd: process.cwd(),
      cleanup: true,
    });
  } catch (e) {
    throw new GenerateNewProjectOnInitError({
      error: e,
      packageManager: packageManagerName,
      projectType: projectDisplayName,
    });
  }

  logger.plain(
    boxen(
      dedent`
      "${projectDisplayName}" project with ${chalk.bold(packageManagerName)} created successfully!

      Continuing with Storybook installation...
    `,
      {
        title: chalk.bold('✅ Success!'),
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'green',
      }
    )
  );
};
