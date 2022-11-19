/* eslint-disable no-console */
import { writeFile } from 'fs-extra';
import { yellow, bold } from 'chalk';
import { command } from 'execa';
import { join } from 'path';
import { allTemplates, templatesByCadence } from '../code/lib/cli/src/repro-templates';

type TemplatesByCadence = typeof templatesByCadence;
type CadenceKey = keyof TemplatesByCadence;
type AffectedResult = {
  [K in CadenceKey]: TemplatesByCadence[K];
};

async function run() {
  const baseTarget = process.env.NX_BASE || 'next';
  let nxCommand = 'yarn nx print-affected';

  if (baseTarget) {
    console.log(`👉 Using NX_BASE hash for NX comparison:${baseTarget}`);
    nxCommand = `${nxCommand} --base=${baseTarget}`;
  }

  console.log(`⚙️ Running command: ${nxCommand}\n`);
  const contents = await command(nxCommand, { cwd: join(__dirname, '..') });

  const affectedPackages = JSON.parse(contents.stdout).projects as string[];

  const allCadences = Object.keys(templatesByCadence) as CadenceKey[];

  if (affectedPackages.length <= 0) {
    console.log('📭 NX detected that no packages were affected by the changes');
    await writeFile(
      join(__dirname, '..', 'affected-templates.json'),
      JSON.stringify(allCadences.reduce((acc, cadence) => ({ ...acc, [cadence]: [] }), {}))
    );
    return;
  }

  console.log(
    `🕵️ Detected the affected Storybook packages: ${affectedPackages
      .map((p) => yellow(p))
      .join(', ')}`
  );

  const hasAddonChanges = affectedPackages.some((p: string) => p.includes('addon'));

  if (hasAddonChanges) {
    console.log('⚠️ All templates are affected because there were changes in addon packages');
  }

  const affectedTemplatesPerCadence = allCadences.reduce((acc, cadence: CadenceKey) => {
    const allTemplatesOfCadence = templatesByCadence[cadence];
    acc[cadence] = hasAddonChanges
      ? allTemplatesOfCadence
      : allTemplatesOfCadence.filter((templateKey) => {
          const template = allTemplates[templateKey];
          if (
            affectedPackages.includes(template.expected.builder) ||
            affectedPackages.includes(template.expected.renderer) ||
            affectedPackages.includes(template.expected.framework)
          ) {
            return true;
          }
          return false;
        }, []);

    return acc;
  }, {} as AffectedResult);

  allCadences.forEach((cadence) => {
    const affectedTemplates = affectedTemplatesPerCadence[cadence];
    if (affectedTemplates.length > 0) {
      console.log(
        `\n🔍 Affected templates for ${bold(cadence)}: ${affectedTemplates
          .map((p) => yellow(p))
          .join(', ')}`
      );
    }
  });

  const outputPath = join(__dirname, '..', 'affected-templates.json');

  console.log(`\n📝 Writing results in ${outputPath}\n`);
  await writeFile(outputPath, JSON.stringify(affectedTemplatesPerCadence));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
