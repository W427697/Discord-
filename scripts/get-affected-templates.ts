/* eslint-disable no-console */
import { writeFile } from 'fs-extra';
import { join } from 'path';
import { execaCommand } from './utils/exec';
import { allTemplates } from '../code/lib/cli/src/repro-templates';

async function run() {
  const baseTarget = process.env.NX_BASE || 'origin/next';
  let nxCommand = 'yarn nx print-affected';

  if (baseTarget) {
    console.log(`Using NX_BASE hash for NX comparison:${baseTarget}`);
    nxCommand = `${nxCommand} --base=${baseTarget}`;
  }

  const contents = await execaCommand(nxCommand, { cwd: join(__dirname, '..') });

  const affectedPackages = JSON.parse(contents.stdout).projects;

  const hasAddonChanges = affectedPackages.some((p: string) => p.includes('addon'));

  const affectedTemplates = hasAddonChanges
    ? Object.keys(allTemplates)
    : Object.entries(allTemplates).reduce((acc, [templateKey, template]) => {
        if (
          affectedPackages.includes(template.expected.builder) ||
          affectedPackages.includes(template.expected.renderer) ||
          affectedPackages.includes(template.expected.framework)
        ) {
          acc.push(templateKey);
        }
        return acc;
      }, []);

  if (affectedTemplates.length > 0) {
    console.log(`🕵️ Detected the affected Storybook packages: ${affectedPackages}`);
    if (hasAddonChanges) {
      console.log('⚠️ All templates are affected because there were changes in an addon');
    }
    console.log(`\n📝 Writing affected templates: ${affectedTemplates}`);
  } else {
    console.log('📭 No templates were affected by the changes');
  }

  await writeFile(
    join(__dirname, '..', 'affected-templates.json'),
    JSON.stringify(affectedTemplates)
  );
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
