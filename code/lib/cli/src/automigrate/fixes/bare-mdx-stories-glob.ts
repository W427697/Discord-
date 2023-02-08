import chalk from 'chalk';
import dedent from 'ts-dedent';
import semver from 'semver';
import type { ConfigFile } from '@storybook/csf-tools';
import { readConfig, writeConfig } from '@storybook/csf-tools';
import { getStorybookInfo } from '@storybook/core-common';
import type { StoriesEntry } from 'lib/types/src';
import type { Fix } from '../types';

const logger = console;

const fixId = 'bare-mdx-stories-glob';

const getNextGlobs = (glob: string) => {
  const nextGlobs: string[] = [];
  const regexMatch = glob.match(/(.*)\.stories\.@\(.*mdx.*\)$/i);
  if (regexMatch) {
    nextGlobs.push(glob.replaceAll('mdx|', '').replaceAll('|mdx', ''));
    nextGlobs.push(`${regexMatch[1]}.mdx`);
    return nextGlobs;
  }
  nextGlobs.push(glob.replaceAll('.stories.mdx', '.mdx'));
  if (glob.includes('.stories.*')) {
    // add a second entry similar to the existing *.stories.*, but for *.mdx
    nextGlobs.push(glob.replaceAll('.stories.*', '.mdx'));
  }
  return nextGlobs;
};

export const bareMdxStoriesGlob: Fix = {
  id: fixId,
  async check({ packageManager }) {
    const packageJson = packageManager.retrievePackageJson();

    const { mainConfig, version: storybookVersion } = getStorybookInfo(packageJson);
    if (!mainConfig) {
      logger.warn('Unable to find storybook main.js config, skipping');
      return null;
    }

    const sbVersionCoerced = storybookVersion && semver.coerce(storybookVersion)?.version;
    if (!sbVersionCoerced) {
      throw new Error(dedent`
        ❌ Unable to determine storybook version.
        🤔 Are you running automigrate from your project directory?
      `);
    }

    if (!semver.gte(sbVersionCoerced, '7.0.0')) {
      return null;
    }

    const existingStoriesEntries = (await readConfig(mainConfig)).getFieldValue([
      'stories',
    ]) as StoriesEntry[];

    if (!existingStoriesEntries) {
      logger.warn(dedent`
      ❌ Unable to determine Storybook stories globs, skipping ${chalk.cyan(fixId)} fix.
      🤔 Are you running automigrate from your project directory?
    `);
      return null;
    }

    console.log('LOG: existing');
    console.dir(existingStoriesEntries, { depth: 5 });

    const nextStoriesEntries: StoriesEntry[] = [];

    existingStoriesEntries.forEach((entry) => {
      const isSpecifier = typeof entry !== 'string';
      const glob = isSpecifier ? entry.files : entry;

      if (!glob) {
        // storySpecifier without the 'files' property. Just add the existing to the next list
        nextStoriesEntries.push(entry);
        return;
      }

      const nextGlobs = getNextGlobs(glob);
      if (isSpecifier) {
        nextStoriesEntries.push(...nextGlobs.map((nextGlob) => ({ ...entry, files: nextGlob })));
      } else {
        nextStoriesEntries.push(...nextGlobs);
      }
    });

    console.log('LOG: next');
    console.dir(nextStoriesEntries, { depth: 5 });

    return { existingStoriesEntries, nextStoriesEntries };

    // show existing globs
    // show how we plan to change them
    // show what the existing target matches
    // show what the new target will match
  },
  prompt() {
    return 'yay';
  },
};
