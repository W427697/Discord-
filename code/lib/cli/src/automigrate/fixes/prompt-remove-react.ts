import dedent from 'ts-dedent';
import semver from 'semver';
import type { StoriesEntry } from 'lib/types/src';
import { commonGlobOptions, normalizeStories } from '@storybook/core-common';
import { isAbsolute, join, relative } from 'path';
import slash from 'slash';
import { glob } from 'glob';
import { getFrameworkPackageName } from '../helpers/mainConfigFile';
import type { Fix } from '../types';

interface Options {
  hasMDX: boolean;
  hasEssentials: boolean;
  hasDocs: boolean;
}

async function detectMDXEntries(entries: StoriesEntry[], configDir: string): Promise<boolean> {
  const list = normalizeStories(entries, {
    configDir,
    workingDir: configDir,
    // defaultFilesPattern: '**/*.@(stories.@(js|jsx|mjs|ts|tsx))',
  });
  const result = (
    await Promise.all(
      list.map(async ({ directory, files, titlePrefix }) => {
        const pattern = join(directory, files);
        const absolutePattern = isAbsolute(pattern) ? pattern : join(configDir, pattern);
        const absoluteDirectory = isAbsolute(directory) ? directory : join(configDir, directory);

        return {
          files: (
            await glob(slash(absolutePattern), {
              ...commonGlobOptions(absolutePattern),
              follow: true,
            })
          ).map((f) => relative(absoluteDirectory, f)),
          directory,
          titlePrefix,
        };
      })
    )
  ).reduce<boolean>((acc, { files }, i) => {
    const filteredEntries = files.filter((s) => !s.endsWith('.mdx'));
    if (filteredEntries.length < files.length) {
      return true;
    }
    return acc;
  }, false);
  return result;
}

export const removeReactDependency: Fix<Options> = {
  id: 'remove-react-dependency',

  async check({ packageManager, mainConfig, storybookVersion, configDir }) {
    let hasMDX = false;
    let hasEssentials = false;
    let hasDocs = false;

    // when the user is using the react renderer, we should not prompt them to remove react
    const frameworkPackageName = getFrameworkPackageName(mainConfig);
    if (frameworkPackageName?.includes('react') || frameworkPackageName?.includes('nextjs')) {
      return null;
    }

    // if the user has no dependency on react, we can skip this fix
    const packageJson = await packageManager.retrievePackageJson();
    if (
      !packageJson?.dependencies?.['react'] &&
      !packageJson?.peerDependencies?.['react'] &&
      !packageJson?.devDependencies?.['react']
    ) {
      return null;
    }

    // do not prompt to remove react for older versions of storybook
    if (!semver.gte(storybookVersion, '8.0.0')) {
      return null;
    }

    const { addons } = mainConfig;
    hasEssentials = !!(
      addons &&
      addons.find((addon) =>
        typeof addon === 'string'
          ? addon.endsWith('@storybook/addon-essentials')
          : addon.name.endsWith('@storybook/addon-essentials')
      )
    );
    hasDocs = !!(
      addons &&
      addons.find((addon) =>
        typeof addon === 'string'
          ? addon.endsWith('@storybook/addon-docs')
          : addon.name.endsWith('@storybook/addon-docs')
      )
    );

    hasMDX = !!(await detectMDXEntries(mainConfig.stories, configDir || process.cwd()));

    return {
      hasMDX,
      hasEssentials,
      hasDocs,
    };
  },
  prompt({ hasMDX, hasDocs, hasEssentials }) {
    const addons = [hasEssentials ? 'essentials' : '', hasDocs ? 'docs' : ''].filter(Boolean);
    const addonReasonText =
      addons.length > 0 ? `, because you are using ${addons.join(' and ')}` : '';

    const start = dedent`
      We detected that your project has a dependency for "react" that it might not need.
      Nothing breaks by having it, you can safely ignore this message, if you wish.

      Storybook asked you to add "react" as a direct dependency in the past${addonReasonText}.
      However, since version 8.0, Storybook no longer requires you to provide "react" as a dependency.
    `;

    if (hasMDX) {
      const mdxSuggestion = dedent`
        As you are using '.mdx'-files, it might be reasonable to keep the dependency.
      `;
      return [start, mdxSuggestion].join('\n\n');
    }

    const removalSuggestion = dedent`
      If you know you are not using React outside of Storybook, it should be safe to remove the "react" and "react-dom" dependencies from your project's package.json.
      Storybook cannot do this automatically as removing it might break your project, so it should be done manually with care.
    `;
    return [start, removalSuggestion].join('\n\n');
  },
};
