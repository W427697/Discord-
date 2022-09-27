import { ensureSymlink, pathExists } from 'fs-extra';
import { join, resolve, sep } from 'path';
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
} from '../sandbox';
import { filterExistsInCodeDir } from '../utils/filterExistsInCodeDir';
import type { Task } from '../task';
import { detectLanguage } from '../../code/lib/cli/src/detect';
import { SupportedLanguage } from '../../code/lib/cli/src/project_types';

export const sandbox: Task = {
  before: ({ link }) => (link ? ['install'] : ['install', 'run-registry-repo']),
  async ready({ sandboxDir }) {
    return pathExists(join(sandboxDir, 'template-stories'));
  },
  // NOTE: this task cannot really be reset in isolation (create also needs to reset)
  async run({ codeDir, sandboxDir, template }, { addon, dryRun, debug }) {
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
  },
};
