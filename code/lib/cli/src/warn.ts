import { fdir as FDir } from 'fdir';
import { logger } from '@storybook/node-logger';

interface Options {
  hasTSDependency: boolean;
}

const crawler = new FDir().onlyCounts().glob('**/*.@(ts|tsx)', '!**/node_modules', '!**/*.d.ts');

export const warn = ({ hasTSDependency }: Options) => {
  if (!hasTSDependency) {
    const counts = crawler.crawl(process.cwd()).sync();
    if ('files' in counts && counts.files > 0) {
      logger.warn(
        'We have detected TypeScript files in your project directory, however TypeScript is not listed as a project dependency.'
      );
      logger.warn('Storybook will continue as though this is a JavaScript project.');
      logger.line();
      logger.info(
        'For more information, see: https://storybook.js.org/docs/configurations/typescript-config/'
      );
    }
  }
};
