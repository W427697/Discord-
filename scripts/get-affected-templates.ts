/* eslint-disable no-console */
import { writeFile } from 'fs-extra';
import { command } from 'execa';
import { join } from 'path';
import { allTemplates } from '../code/lib/cli/src/repro-templates';

async function run() {
  const contents = await command('yarn nx print-affected', { cwd: join(__dirname, '..') });

  const affectedPackages = JSON.parse(contents.stdout).projects;

  const affectedTemplates = Object.entries(allTemplates).reduce((acc, [templateKey, template]) => {
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
    console.log(`Detected the affected Storybook packages: ${affectedPackages}\n`);
    console.log(`Writing affected templates: ${affectedTemplates}`);
  } else {
    console.log('No templates were affected by the changes');
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
