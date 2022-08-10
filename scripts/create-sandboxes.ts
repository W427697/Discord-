import { ensureDir } from 'fs-extra';
import { basename, resolve } from 'path';
import { createOptions, getOptionsOrPrompt } from './utils/options';
import { options as oncePerTemplateOptions, oncePerTemplate } from './once-per-template';

const scriptName = basename(__filename, 'ts');
const sandboxDir = resolve(__dirname, '../sandbox');
const logger = console;

export const options = createOptions({
  cadence: oncePerTemplateOptions.cadence,
  junit: oncePerTemplateOptions.junit,
});

async function run() {
  const { cadence, junit } = await getOptionsOrPrompt(`yarn ${scriptName}`, options);

  await ensureDir(sandboxDir);

  return oncePerTemplate({
    step: 'Creating',
    cd: false,
    cadence,
    parallel: true,
    junit,
    scriptName: 'sandbox',
    templateCommand: (template) =>
      `yarn sandbox --no-link --no-start --no-publish --template ${template}`,
  });
}

if (require.main === module) {
  run().catch((err) => {
    logger.error(`🚨 An error occurred when executing "${scriptName}":`);
    logger.error(err);
    process.exit(1);
  });
}
