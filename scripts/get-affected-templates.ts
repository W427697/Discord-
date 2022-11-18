/* eslint-disable no-console */
import { writeFile } from 'fs-extra';
import { command } from 'execa';
import { join } from 'path';
import { allTemplates } from '../code/lib/cli/src/repro-templates';

async function run() {
  let nxCommand = 'yarn nx print-affected';

  if (process.env.NX_BASE) {
    console.log(`Using NX_BASE hash for NX comparison:${process.env.NX_BASE}`);
    nxCommand = `${nxCommand} --base=${process.env.NX_BASE}`;
  }

  const contents = await command(nxCommand, { cwd: join(__dirname, '..') });

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
