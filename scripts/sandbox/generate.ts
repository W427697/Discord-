/* eslint-disable no-console */
import { join, relative } from 'path';
import { execSync } from 'child_process';
import { type Options as ExecaOptions } from 'execa';
import pLimit from 'p-limit';
import prettyTime from 'pretty-hrtime';
import { copy, emptyDir, ensureDir, move, readFile, remove, writeFile } from 'fs-extra';
import { program } from 'commander';
import { directory } from 'tempy';
import findUp from 'find-up';
import { execaCommand } from '../utils/exec';

import type { OptionValues } from '../utils/options';
import { createOptions } from '../utils/options';
import type { TemplateKey } from '../../code/lib/cli/src/sandbox-templates';
import {
  isPnpmTemplate,
  allTemplates as sandboxTemplates,
} from '../../code/lib/cli/src/sandbox-templates';

import { maxConcurrentTasks } from '../utils/maxConcurrentTasks';

import type { GeneratorConfig } from './utils/types';
import { getStackblitzUrl, renderTemplate } from './utils/template';
import {
  BEFORE_DIR_NAME,
  AFTER_DIR_NAME,
  SCRIPT_TIMEOUT,
  REPROS_DIRECTORY,
  LOCAL_REGISTRY_URL,
  DEFAULT_REGISTRY_URL,
} from '../utils/constants';
import {
  JsPackageManagerFactory,
  NPM_LOCKFILE,
  PNPM_LOCKFILE,
  YARN_LOCKFILE,
} from '../../code/lib/cli/src/js-package-manager';
import versions from '../../code/lib/cli/src/versions';

const sbInit = async (cwd: string, flags?: string[], debug?: boolean) => {
  const sbCliBinaryPath = join(__dirname, `../../code/lib/cli/bin/index.js`);
  console.log(`🎁 Installing storybook`);
  const env = { STORYBOOK_DISABLE_TELEMETRY: 'true', YARN_ENABLE_IMMUTABLE_INSTALLS: 'false' };
  const fullFlags = ['--yes', ...(flags || [])];
  await runCommand(`${sbCliBinaryPath} init ${fullFlags.join(' ')}`, { cwd, env }, debug);
};

const withLocalRegistry = async (
  { dir, dirName }: { dir: string; dirName: TemplateKey },
  action: () => Promise<void>
) => {
  execSync(`npm config set registry ${LOCAL_REGISTRY_URL} --location project`, { cwd: dir });
  execSync(`npm config set audit false --location project`, { cwd: dir });
  execSync(`npm config set prefer-offline true --location project`, { cwd: dir });

  try {
    if (isPnpmTemplate(dirName)) {
      execSync(`pnpm config set prefer-frozen-lockfile false --location project`, { cwd: dir });
    }
  } catch (e) {
    // ignore, pnpm doesn't seem to be installed
  }
  await action();
};

const addStorybook = async ({
  dir,
  localRegistry,
  flags,
  debug,
  dirName,
}: {
  dir: string;
  localRegistry: boolean;
  flags?: string[];
  debug?: boolean;
  dirName: TemplateKey;
}) => {
  const packageManager = JsPackageManagerFactory.getPackageManager({}, dir);
  // Prerelease versions of Angular are not allowed per default in the defined peer dependency range of @storybook/angular
  // Therefore we have to activate the legacy-peer-deps mode for it to allow installation nevertheless
  if (dirName === 'angular-cli/prerelease') {
    execSync('npm config set legacy-peer-deps true --location project', { cwd: dir });
  }

  if (localRegistry) {
    await withLocalRegistry({ dir, dirName }, async () => {
      // We need to resolve some transitive @storybook/* packages from third-party dependencies to the local registry
      // otherwise the package manager will try to install them from verdaccio and will fail
      // This is because we don't have resolutions for every package anymore. We need to add packages on a case by case basis.
      // If it's troublesome, we can bring back resolutions for every package, with the caveat that it makes things quite slower
      packageManager.addPackageResolutions({
        '@storybook/addon-onboarding': {
          '@storybook/telemetry': versions['@storybook/telemetry'],
        },
        ...(dirName === 'qwik-vite/default-ts'
          ? {
              'storybook-framework-qwik': {
                '@storybook/builder-vite': versions['@storybook/builder-vite'],
                '@storybook/docs-tools': versions['@storybook/docs-tools'],
              },
            }
          : {}),
      });
      await sbInit(dir, flags, debug);
    });
  } else {
    await sbInit(dir, flags, debug);
  }
};

export const runCommand = async (script: string, options: ExecaOptions, debug = false) => {
  if (debug) {
    console.log(`Running command: ${script}`);
  }

  return execaCommand(script, {
    stdout: debug ? 'inherit' : 'ignore',
    shell: true,
    ...options,
  });
};

const addDocumentation = async (
  dir: string,
  { name, dirName }: { name: string; dirName: string }
) => {
  const stackblitzConfigPath = join(__dirname, 'templates', '.stackblitzrc');
  const readmePath = join(__dirname, 'templates', 'item.ejs');

  await copy(stackblitzConfigPath, join(dir, '.stackblitzrc'));

  const stackblitzUrl = getStackblitzUrl(dirName);
  const contents = await renderTemplate(readmePath, {
    name,
    stackblitzUrl,
  });
  await writeFile(join(dir, 'README.md'), contents);
};

const improveNPMPerformance = async (dir: string) => {
  // write a package.json file into dir with a dummy name property
  // this will prevent npm from walking up the directory tree to find
  // a package.json file and the project .npmrc file
  await writeFile(
    join(dir, 'package.json'),
    JSON.stringify({
      name: 'temp',
      license: 'MIT',
    })
  );
  // write a npmrc file into dir to set prefer-offline to true and audit to false
  // this will prevent npm from making unnecessary network requests
  await writeFile(join(dir, '.npmrc'), 'prefer-offline=true\naudit=false');
};

const runGenerators = async (
  generators: (GeneratorConfig & { dirName: TemplateKey })[],
  localRegistry = true,
  debug = false
) => {
  if (generators.length > 1) {
    console.log(
      `🤹‍♂️ Generating sandboxes with a concurrency of ${
        generators.length > maxConcurrentTasks ? maxConcurrentTasks : generators.length
      }`
    );
  }

  const limit = pLimit(1);

  await Promise.all(
    generators.map(({ dirName, name, script, expected }) =>
      limit(async () => {
        let flags: string[] = [];
        if (expected.renderer === '@storybook/html') flags = ['--type html'];
        else if (expected.renderer === '@storybook/server') flags = ['--type server'];

        const time = process.hrtime();
        console.log(`🧬 Generating ${dirName} (${name})`);

        const baseDir = join(REPROS_DIRECTORY, dirName);
        const beforeDir = join(baseDir, BEFORE_DIR_NAME);
        const afterDir = join(baseDir, AFTER_DIR_NAME);

        await emptyDir(baseDir);

        // We do the creation inside a temp dir to avoid yarn container problems
        const tempDir = directory();

        const tempInitDir = join(tempDir, BEFORE_DIR_NAME);

        // await improveNPMPerformance(tempDir);

        // Some tools refuse to run inside an existing directory and replace the contents,
        // where as others are very picky about what directories can be called. So we need to
        // handle different modes of operation.
        if (script.includes('{{beforeDir}}')) {
          const scriptWithBeforeDir = script.replaceAll('{{beforeDir}}', BEFORE_DIR_NAME);

          await runCommand(
            scriptWithBeforeDir,
            {
              cwd: tempDir,
              timeout: SCRIPT_TIMEOUT,
              stderr: 'inherit',
              env: {
                // CRA for example uses npm_config_user_agent to determine if it should use yarn or npm
                // eslint-disable-next-line no-nested-ternary
                npm_config_user_agent: scriptWithBeforeDir.startsWith('yarn')
                  ? 'yarn'
                  : scriptWithBeforeDir.startsWith('pnpm')
                  ? 'pnpm'
                  : 'npm',
              },
            },
            debug
          );
        } else {
          await ensureDir(tempInitDir);
          await runCommand(script, { cwd: tempInitDir, timeout: SCRIPT_TIMEOUT }, debug);
        }

        // Move the initialized project into the beforeDir without node_modules and .git
        await copy(tempInitDir, beforeDir, {
          filter: (src) => {
            return src.indexOf('node_modules') === -1 && src.indexOf('.git') === -1;
          },
        });

        const lockFilePathBeforeDir = findUp.sync([YARN_LOCKFILE, PNPM_LOCKFILE, NPM_LOCKFILE], {
          cwd: tempInitDir,
        });
        await remove(lockFilePathBeforeDir);

        await addStorybook({ dir: tempInitDir, localRegistry, flags, debug, dirName });

        await move(tempInitDir, afterDir);

        await addDocumentation(afterDir, { name, dirName });

        // Remove installation artifacts to save space and avoid GH actions failing
        // They're not uploaded to the git sandboxes repo anyway
        if (process.env.CLEANUP_SANDBOX_NODE_MODULES) {
          console.log(`🗑️ Removing installation artifacts`);
          await remove(join(afterDir, 'node_modules'));
          await remove(join(afterDir, '.yarn', 'cache'));
          await remove(join(afterDir, '.yarn', 'unplugged'));
        }

        await remove(join(afterDir, '.npmrc'));

        // All dependency references in the lock file use the verdaccio registry. We need to replace them
        // with the default registry, otherwise users will get errors when trying to install
        if (localRegistry) {
          const lockFilePath = findUp.sync([YARN_LOCKFILE, PNPM_LOCKFILE, NPM_LOCKFILE], {
            cwd: afterDir,
          });

          console.log(`🔀 Replacing local registry references with default registry`);
          const lockFile = await readFile(lockFilePath, 'utf-8');
          const newLockFile = lockFile.replaceAll(LOCAL_REGISTRY_URL, DEFAULT_REGISTRY_URL);
          await writeFile(lockFilePath, newLockFile);
        }

        await remove(tempDir);

        console.log(
          `✅ Created ${dirName} in ./${relative(
            process.cwd(),
            baseDir
          )} successfully in ${prettyTime(process.hrtime(time))}`
        );
      })
    )
  );
};

export const options = createOptions({
  template: {
    type: 'string',
    description: 'Which template would you like to create?',
    values: Object.keys(sandboxTemplates),
  },
  localRegistry: {
    type: 'boolean',
    description: 'Generate reproduction from local registry?',
    promptType: false,
  },
  debug: {
    type: 'boolean',
    description: 'Print all the logs to the console',
    promptType: false,
  },
});

export const generate = async ({
  template,
  localRegistry,
  debug,
}: OptionValues<typeof options>) => {
  const generatorConfigs = Object.entries(sandboxTemplates)
    .map(([dirName, configuration]) => ({
      dirName: dirName as TemplateKey,
      ...configuration,
    }))
    .filter(({ dirName, name }) => {
      if (template) {
        return dirName === template;
      }

      return (
        dirName.match(/^(react|vue3|lit)-vite|angular-cli\/default-ts/) &&
        !name.includes('npm') &&
        name.includes('TypeScript') &&
        !name.includes('prerelease')
      );

      return true;
    });

  await runGenerators(generatorConfigs, localRegistry, debug);
};

if (require.main === module) {
  program
    .description('Generate sandboxes from a set of possible templates')
    .option('--template <template>', 'Create a single template')
    .option('--debug', 'Print all the logs to the console')
    .option('--local-registry', 'Use local registry', false)
    .action((optionValues) => {
      generate(optionValues)
        .catch((e) => {
          console.trace(e);
          process.exit(1);
        })
        .then(() => {
          // FIXME: Kill dangling processes. For some reason in CI,
          // the abort signal gets executed but the child process kill
          // does not succeed?!?
          process.exit(0);
        });
    })
    .parse(process.argv);
}
