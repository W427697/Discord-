import { basename } from 'path';
import { createOptions, getOptionsOrPrompt } from './utils/options';
import { options as oncePerTemplateOptions, oncePerTemplate } from './once-per-template';

const scriptName = basename(__filename, 'ts');
const logger = console;

export const options = createOptions({
  cadence: oncePerTemplateOptions.cadence,
  junit: oncePerTemplateOptions.junit,
});

async function run() {
  const { cadence, junit } = await getOptionsOrPrompt(`yarn ${scriptName}`, options);

  return oncePerTemplate({
    step: 'Smoke Testing',
    cd: true,
    cadence,
    parallel: false,
    junit,
    scriptName: 'sandbox',
    templateCommand: () => 'yarn storybook --smoke-test --quiet',
  });
}

if (require.main === module) {
  run().catch((err) => {
    logger.error(`🚨 An error occurred when executing "${scriptName}":`);
    logger.error(err);
    process.exit(1);
  });
}
