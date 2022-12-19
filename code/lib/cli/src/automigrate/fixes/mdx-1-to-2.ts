import chalk from 'chalk';
import { dedent } from 'ts-dedent';
import { basename } from 'path';
import fse from 'fs-extra';
import globby from 'globby';
import type { Fix } from '../types';

const MDX1_SCRIPT_START = /<style>{`/g;
const MDX1_SCRIPT_END = /`}<\/style>/g;

export const fixMdxScript = (mdx: string) => {
  return mdx.replace(MDX1_SCRIPT_START, '<style>\n  {`').replace(MDX1_SCRIPT_END, '  `}\n</style>');
};

const logger = console;

interface Mdx1to2Options {
  storiesMdxFiles: string[];
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
    return storiesMdxFiles.length ? { storiesMdxFiles } : undefined;
  },

  prompt({ storiesMdxFiles }) {
    return dedent`
      We've found ${chalk.yellow(storiesMdxFiles.length)} '.stories.mdx' files in your project.
      
      Storybook has upgraded to MDX2 (https://mdxjs.com/blog/v2/), which contains breaking changes from V1.
      We can try to automatically upgrade your MDX files to MDX2 format using some common patterns.
      
      Some steps might require manual intervention. You can find a full guide for how to manually upgrade your files here:
      ${chalk.cyan('https://storybook.js.org/docs/react/writing-docs/mdx#upgrading-to-mdx2')}
    `;
  },

  async run({ result: { storiesMdxFiles }, dryRun }) {
    await Promise.all(
      storiesMdxFiles.map(async (fname) => {
        const contents = await fse.readFile(fname, 'utf-8');
        const updated = fixMdxScript(contents);
        if (updated === contents) {
          logger.info(`🆗 Unmodified ${basename(fname)}`);
        } else {
          logger.info(`✅ Modified ${basename(fname)}`);
          if (!dryRun) {
            await fse.writeFile(fname, updated);
          }
        }
      })
    );
  },
};
