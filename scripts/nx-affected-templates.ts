/* eslint-disable no-console */
import { readJson, writeFile } from 'fs-extra';
import { join } from 'path';
import { ci, allTemplates, type TemplateKey } from '../code/lib/cli/src/sandbox-templates';
import { execaCommand } from './utils/exec';

const affectedTemplatesPath = join(__dirname, '..', 'affected-templates.json');

// check whether a given template is related to affected packages (via nx affected graph)
export const shouldSkipTask = async (template: TemplateKey) => {
  try {
    const affectTemplates = (await readJson(affectedTemplatesPath)) as string[];
    // we want to always test the most basic templates, for safety (coming from CI cadence)
    return !affectTemplates.concat(ci).includes(template);
  } catch (e) {
    // return false if the file doesn't exist
    return false;
  }
};

async function run() {
  const baseTarget = process.env.NX_BASE || 'origin/next';
  let nxCommand = 'yarn nx print-affected';

  console.log(`Using the following NX_BASE hash for NX comparison: ${baseTarget}\n`);
  nxCommand = `${nxCommand} --base=${baseTarget}`;

  const contents = await execaCommand(nxCommand, { cwd: join(__dirname, '..') });

  const affectedPackages = JSON.parse(contents.stdout).projects as string[];

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
    console.log(
      `🕵️  Detected the affected Storybook packages:\n${affectedPackages
        .map((v) => `- ${v}`)
        .join('\n')}`
    );
    if (hasAddonChanges) {
      console.log('⚠️ All templates are affected because there were changes in an addon');
    }
    console.log(
      `\n📝 Writing affected templates:\n${affectedTemplates.map((v) => `- ${v}`).join('\n')}`
    );
  } else {
    console.log('📭 No templates were affected by the changes');
  }

  await writeFile(
    join(__dirname, '..', 'affected-templates.json'),
    JSON.stringify(affectedTemplates)
  );
}

if (require.main === module) {
  run().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
