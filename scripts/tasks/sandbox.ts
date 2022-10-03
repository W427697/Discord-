/* eslint-disable no-restricted-syntax, no-await-in-loop */

import { copy, ensureSymlink, ensureDir, existsSync, pathExists, remove } from 'fs-extra';
import { join, resolve, sep } from 'path';
import dedent from 'ts-dedent';

import { defaultAddons, Task } from '../task';
import { executeCLIStep, steps } from '../utils/cli-step';
import { installYarn2, configureYarn2ForVerdaccio, addPackageResolutions } from '../utils/yarn';
import { exec } from '../utils/exec';
import { ConfigFile, writeConfig } from '../../code/lib/csf-tools';
import { filterExistsInCodeDir } from '../utils/filterExistsInCodeDir';
import { findFirstPath } from '../utils/paths';
import { detectLanguage } from '../../code/lib/cli/src/detect';
import { SupportedLanguage } from '../../code/lib/cli/src/project_types';
import { addPackageScripts } from '../utils/package-json';
import { addPreviewAnnotations, readMainConfig } from '../utils/main-js';
import { JsPackageManagerFactory } from '../../code/lib/cli/src/js-package-manager';
import { workspacePath } from '../utils/workspace';
import { babelParse } from '../../code/lib/csf-tools/src/babelParse';

const logger = console;

const reprosDir = resolve(__dirname, '../repros');
const codeDir = resolve(__dirname, '../code');

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
  for (const addon of addons) {
    const addonName = `@storybook/addon-${addon}`;
    await executeCLIStep(steps.add, { argument: addonName, cwd, dryRun, debug });
  }

  const mainConfig = await readMainConfig({ cwd });
  mainConfig.setFieldValue(['core', 'disableTelemetry'], true);
  if (template.expected.builder === '@storybook/builder-vite') forceViteRebuilds(mainConfig);
  await writeConfig(mainConfig);
};

const install: Task['run'] = async ({ sandboxDir }, { link, dryRun, debug }) => {
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

  logger.info(`🔢 Adding package scripts:`);
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

// Ensure that sandboxes can refer to story files defined in `code/`.
// Most WP-based build systems will not compile files outside of the project root or 'src/` or
// similar. Plus they aren't guaranteed to handle TS files. So we need to patch in esbuild
// loader for such files. NOTE this isn't necessary for Vite, as far as we know.
export function addEsbuildLoaderToStories(mainConfig: ConfigFile) {
  // NOTE: the test regexp here will apply whether the path is symlink-preserved or otherwise
  const loaderPath = require.resolve('../code/node_modules/esbuild-loader');
  const webpackFinalCode = `
  (config) => ({
    ...config,
    module: {
      ...config.modules,
      rules: [
        {
          test: [/\\/template-stories\\//],
          loader: '${loaderPath}',
          options: {
            loader: 'tsx',
            target: 'es2015',
          },
        },
        ...config.module.rules,
      ],
    },
  })`;
  mainConfig.setFieldNode(
    ['webpackFinal'],
    // @ts-expect-error (not sure why TS complains here, it does exist)
    babelParse(webpackFinalCode).program.body[0].expression
  );
}

// Recompile optimized deps on each startup, so you can change @storybook/* packages and not
// have to clear caches.
export function forceViteRebuilds(mainConfig: ConfigFile) {
  const viteFinalCode = `
  (config) => ({
    ...config,
    optimizeDeps: {
      ...config.optimizeDeps,
      force: true,
    },
  })`;
  mainConfig.setFieldNode(
    ['viteFinal'],
    // @ts-expect-error (not sure why TS complains here, it does exist)
    babelParse(viteFinalCode).program.body[0].expression
  );
}

// packageDir is eg 'renderers/react', 'addons/actions'
export async function linkPackageStories(
  packageDir: string,
  { mainConfig, cwd, linkInDir }: { mainConfig: ConfigFile; cwd: string; linkInDir?: string }
) {
  const source = join(codeDir, packageDir, 'template', 'stories');
  // By default we link `stories` directories
  //   e.g '../../../code/lib/store/template/stories' to 'template-stories/lib/store'
  // if the directory <code>/lib/store/template/stories exists
  //
  // The files must be linked in the cwd, in order to ensure that any dependencies they
  // reference are resolved in the cwd. In particular 'react' resolved by MDX files.
  const target = linkInDir
    ? resolve(linkInDir, packageDir)
    : resolve(cwd, 'template-stories', packageDir);
  await ensureSymlink(source, target);

  // Add `previewAnnotation` entries of the form
  //   './template-stories/lib/store/preview.ts'
  // if the file <code>/lib/store/template/stories/preview.ts exists

  const previewFile = join(codeDir, packageDir, 'template', 'stories', 'preview.ts');
  if (await pathExists(previewFile)) {
    addPreviewAnnotations(mainConfig, [`./${join('template-stories', packageDir, 'preview.ts')}`]);
  }
}

// Update the stories field to ensure that:
//  a) no TS files that are linked from the renderer are picked up in non-TS projects
//  b) files in ./template-stories are not matched by the default glob
export async function updateStoriesField(mainConfig: ConfigFile, isJs: boolean) {
  const stories = mainConfig.getFieldValue(['stories']) as string[];

  // If the project is a JS project, let's make sure any linked in TS stories from the
  // renderer inside src|stories are simply ignored.
  const updatedStories = isJs
    ? stories.map((specifier) => specifier.replace('js|jsx|ts|tsx', 'js|jsx'))
    : stories;

  // FIXME: '*.@(mdx|stories.mdx|stories.tsx|stories.ts|stories.jsx|stories.js'
  const linkedStories = join('..', 'template-stories', '**', '*.stories.@(js|jsx|ts|tsx|mdx)');

  mainConfig.setFieldValue(['stories'], [...updatedStories, linkedStories]);
}

export function addExtraDependencies({
  cwd,
  dryRun,
  debug,
}: {
  cwd: string;
  dryRun: boolean;
  debug: boolean;
}) {
  const extraDeps = ['@storybook/jest'];
  if (debug) logger.log('🎁 Adding extra deps', extraDeps);
  if (!dryRun) {
    const packageManager = JsPackageManagerFactory.getPackageManager(false, cwd);
    packageManager.addDependencies({ installAsDevDependencies: true }, extraDeps);
  }
}

const addStories: Task['run'] = async ({ sandboxDir, template }, { addon, dryRun, debug }) => {
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
      logger.info('🗑  Removing old sandbox dir');
      await remove(details.sandboxDir);
    }
    await create(details, options);
    await install(details, options);
    await addStories(details, options);
  },
};
