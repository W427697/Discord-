import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import { basename } from 'path';
import fse from 'fs-extra';
import globby from 'globby';
import type { Fix } from '../types';

const MDX1_STYLE_START = /<style>{`/g;
const MDX1_STYLE_END = /`}<\/style>/g;
const MDX1_COMMENT = /<!--(.+)-->/g;

export const fixMdxStyleTags = (mdx: string) => {
  return mdx.replace(MDX1_STYLE_START, '<style>\n  {`').replace(MDX1_STYLE_END, '  `}\n</style>');
};

export const fixMdxComments = (mdx: string) => {
  return mdx.replace(MDX1_COMMENT, (original, group) => `{/*${group}*/}`);
};

const logger = console;

interface Mdx1to2Options {
  storiesMdxFiles: string[];
  allMdxFiles: string[];
  nonStoriesMdx1Files: string[];
}

/**
 * Does the user have `.stories.mdx` files?
 *
 * If so:
 * - Assume they might be MDX1
 * - Offer to help migrate to MDX2
 */
export const mdx1to2: Fix<Mdx1to2Options> = {
  id: 'mdx1to2',

  async check() {
    const storiesMdxFiles = await globby('./!(node_modules)**/*.(story|stories).mdx');
    const allMdxFiles = await globby('./!(node_modules)**/*.mdx');

    const nonStoriesMdx1Files = allMdxFiles.filter((fname) => !storiesMdxFiles.includes(fname));

    return storiesMdxFiles.length
      ? { storiesMdxFiles, allMdxFiles, nonStoriesMdx1Files }
      : undefined;
  },

  prompt({ storiesMdxFiles }) {
    return dedent`
      We've found ${chalk.yellow(storiesMdxFiles.length)} '.stories.mdx' files in your project.
      
      Storybook has upgraded to MDX2 (https://mdxjs.com/blog/v2/), which contains breaking changes from V1.

      We can try to automatically upgrade your MDX files to MDX2 format using some common patterns.
      
      For a full guide for how to manually upgrade your files, see the MDX2 migration guide:
      
      ${chalk.cyan('https://mdxjs.com/migrating/v2/#update-mdx-files')}
    `;
  },

  async run({ result: { storiesMdxFiles, nonStoriesMdx1Files }, dryRun }) {
    await Promise.all([
      ...storiesMdxFiles.map(async (fname) => {
        const contents = await fse.readFile(fname, 'utf-8');
        const updated = fixMdxComments(fixMdxStyleTags(contents));
        if (updated === contents) {
          logger.info(`🆗 Unmodified ${basename(fname)}`);
        } else {
          logger.info(`✅ Modified ${basename(fname)}`);
          if (!dryRun) {
            await fse.writeFile(fname, updated);
          }
        }
      }),
      ...nonStoriesMdx1Files.map(async (fname) => {
        const contents = await fse.readFile(fname, 'utf-8');
        const updated = fixMdxComments(contents);
        if (updated === contents) {
          logger.info(`🆗 Unmodified ${basename(fname)}`);
        } else {
          logger.info(`✅ Modified ${basename(fname)}`);
          if (!dryRun) {
            await fse.writeFile(fname, updated);
          }
        }
      }),
    ]);
  },
};
