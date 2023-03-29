import { listCodemods, runCodemod } from '@storybook/codemod';
import { runFixes } from './automigrate';
import { bareMdxStoriesGlob } from './automigrate/fixes/bare-mdx-stories-glob';

export async function migrate(migration: any, { glob, dryRun, list, rename, logger, parser }: any) {
  if (list) {
    listCodemods().forEach((key: any) => logger.log(key));
  } else if (migration) {
    if (migration === 'mdx-to-csf') {
      await runFixes({ fixes: [bareMdxStoriesGlob] });
    }
    await runCodemod(migration, { glob, dryRun, logger, rename, parser });
  } else {
    throw new Error('Migrate: please specify a migration name or --list');
  }
}
