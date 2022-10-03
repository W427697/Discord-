/* eslint-disable no-restricted-syntax, no-await-in-loop */

import { copy, ensureSymlink, ensureDir, existsSync, pathExists, remove } from 'fs-extra';
import { join, resolve, sep } from 'path';
import dedent from 'ts-dedent';

import type { Task } from '../task';
import { executeCLIStep } from '../utils/cli-step';
import { installYarn2, configureYarn2ForVerdaccio, addPackageResolutions } from '../utils/yarn';
import { exec } from '../utils/exec';
import { writeConfig } from '../../code/lib/csf-tools';
import {
  addEsbuildLoaderToStories,
  addExtraDependencies,
  addPreviewAnnotations,
  defaultAddons,
  findFirstPath,
  linkPackageStories,
  readMainConfig,
  updateStoriesField,
  workspacePath,
  addPackageScripts,
  forceViteRebuilds,
  steps,
} from '../sandbox';
import { filterExistsInCodeDir } from '../utils/filterExistsInCodeDir';
import { detectLanguage } from '../../code/lib/cli/src/detect';
import { SupportedLanguage } from '../../code/lib/cli/src/project_types';

const reprosDir = resolve(__dirname, '../repros');

const logger = console;

const create: Task['run'] = async (
  { key, template, sandboxDir },
  { addon: addons, fromLocalRepro, dryRun, debug }
) => {
  const parentDir = resolve(sandboxDir, '..');
  await ensureDir(parentDir);

  if (fromLocalRepro) {
    const srcDir = join(reprosDir, key, 'after-storybook');
    if (!existsSync(srcDir)) {
      throw new Error(dedent`
          Missing repro directory '${srcDir}'!

          To run sandbox against a local repro, you must have already generated
          the repro template in the /repros directory using:
          the repro template in the /repros directory using:

          yarn generate-repros-next --template ${key}
        `);
    }
    await copy(srcDir, sandboxDir);
  } else {
    await executeCLIStep(steps.repro, {
      argument: key,
      optionValues: { output: sandboxDir, branch: 'next' },
      cwd: parentDir,
      dryRun,
      debug,
    });
  }

  const cwd = sandboxDir;

  // TODO -- sb add <addon> doesn't actually work properly:
  //   - installs in `deps` not `devDeps`
  //   - does a `workspace:^` install (what does that mean?)
  //   - doesn't add to `main.js`

  for (const addon of addons) {
    const addonName = `@storybook/addon-${addon}`;
    await executeCLIStep(steps.add, { argument: addonName, cwd, dryRun, debug });
  }

  const mainConfig = await readMainConfig({ cwd });
  mainConfig.setFieldValue(['core', 'disableTelemetry'], true);
  if (template.expected.builder === '@storybook/builder-vite') forceViteRebuilds(mainConfig);
  await writeConfig(mainConfig);
};

const install: Task['run'] = async ({ codeDir, sandboxDir }, { link, dryRun, debug }) => {
  const cwd = sandboxDir;

  await installYarn2({ cwd, dryRun, debug });

  if (link) {
    await executeCLIStep(steps.link, {
      argument: sandboxDir,
      cwd: codeDir,
      optionValues: { local: true, start: false },
      dryRun,
      debug,
    });
  } else {
    // We need to add package resolutions to ensure that we only ever install the latest version
    // of any storybook packages as verdaccio is not able to both proxy to npm and publish over
    // the top. In theory this could mask issues where different versions cause problems.
    await addPackageResolutions({ cwd, dryRun, debug });
    await configureYarn2ForVerdaccio({ cwd, dryRun, debug });

    await exec(
      'yarn install',
      { cwd },
      {
        dryRun,
        startMessage: `⬇️ Installing local dependencies`,
        errorMessage: `🚨 Installing local dependencies failed`,
      }
    );
  }

  await addPackageScripts({
    cwd,
    scripts: {
      storybook:
        'NODE_OPTIONS="--preserve-symlinks --preserve-symlinks-main" storybook dev -p 6006',
      'build-storybook':
        'NODE_OPTIONS="--preserve-symlinks --preserve-symlinks-main" storybook build',
    },
  });
};

const addStories: Task['run'] = async (
  { codeDir, sandboxDir, template },
  { addon, dryRun, debug }
) => {
  const cwd = sandboxDir;
  const storiesPath = await findFirstPath([join('src', 'stories'), 'stories'], { cwd });

  const mainConfig = await readMainConfig({ cwd });

  // Link in the template/components/index.js from store, the renderer and the addons
  const rendererPath = await workspacePath('renderer', template.expected.renderer);
  await ensureSymlink(
    join(codeDir, rendererPath, 'template', 'components'),
    resolve(cwd, storiesPath, 'components')
  );
  addPreviewAnnotations(mainConfig, [`.${sep}${join(storiesPath, 'components')}`]);

  // Add stories for the renderer. NOTE: these *do* need to be processed by the framework build system
  await linkPackageStories(rendererPath, {
    mainConfig,
    cwd,
    linkInDir: resolve(cwd, storiesPath),
  });

  // Add stories for lib/store (and addons below). NOTE: these stories will be in the
  // template-stories folder and *not* processed by the framework build config (instead by esbuild-loader)
  await linkPackageStories(await workspacePath('core package', '@storybook/store'), {
    mainConfig,
    cwd,
  });

  const addonDirs = await Promise.all(
    [...defaultAddons, ...addon].map(async (anAddon) =>
      workspacePath('addon', `@storybook/addon-${anAddon}`)
    )
  );
  const existingStories = await filterExistsInCodeDir(addonDirs, join('template', 'stories'));
  await Promise.all(
    existingStories.map(async (packageDir) => linkPackageStories(packageDir, { mainConfig, cwd }))
  );

  // Ensure that we match stories from the template-stories dir
  const packageJson = await import(join(cwd, 'package.json'));
  await updateStoriesField(
    mainConfig,
    detectLanguage(packageJson) === SupportedLanguage.JAVASCRIPT
  );

  // Add some extra settings (see above for what these do)
  if (template.expected.builder === '@storybook/builder-webpack5')
    addEsbuildLoaderToStories(mainConfig);

  // Some addon stories require extra dependencies
  addExtraDependencies({ cwd, dryRun, debug });
};

export const sandbox: Task = {
  before: ({ link }) => (link ? ['bootstrap-repo'] : ['bootstrap-repo', 'registry-repo']),
  async ready({ sandboxDir }) {
    return pathExists(sandboxDir);
  },
  async run(details, options) {
    if (this.ready(details)) {
      logger.info('🗑 Removing old sandbox dir');
      await remove(details.sandboxDir);
    }
    await create(details, options);
    await install(details, options);
    await addStories(details, options);
  },
};
