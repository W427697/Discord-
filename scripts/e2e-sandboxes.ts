import { basename } from 'path';
import { createOptions, getOptionsOrPrompt } from './utils/options';
import { oncePerTemplate } from './once-per-template';

const scriptName = basename(__filename, 'ts');
const logger = console;

export const options = createOptions({
  cadence: {
    type: 'string',
    description: 'What cadence are we running on (i.e. which templates should we use)?',
    values: ['ci', 'daily', 'weekly'] as const,
    required: true,
  },
  junit: {
    type: 'string',
    description: 'Report results to junit XML file at path',
  },
});

async function run() {
  const { cadence, junit } = await getOptionsOrPrompt(`yarn ${scriptName}`, options);

  return oncePerTemplate({
    step: 'Running E2E Tests',
    cd: false,
    cadence,
    parallel: false,
    junit: undefined,
    scriptName: 'e2e',
    templateCommand: (template) => ({
      command: 'yarn playwright',
      execaOptions: {
        env: {
          STORYBOOK_URL: `http://localhost:8001/${template.replace('/', '-')}/`,
          ...(junit && {
            PLAYWRIGHT_JUNIT_OUTPUT_NAME: junit.replace(
              '.xml',
              `-${template.replace('/', '-')}.xml`
            ),
          }),
        },
      },
    }),
  });
}

if (require.main === module) {
  run().catch((err) => {
    logger.error(`🚨 An error occurred when executing "${scriptName}":`);
    logger.error(err);
    process.exit(1);
  });
}
