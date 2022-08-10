import { ensureDir } from 'fs-extra';
import { resolve } from 'path';
import { createOptions, getOptionsOrPrompt } from './utils/options';
import { oncePerTemplate } from './once-per-template';

const scriptName = 'build-sandboxes';
const sandboxDir = resolve(__dirname, '../sandbox');
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

  await ensureDir(sandboxDir);
  return oncePerTemplate({
    step: 'Building',
    cd: false,
    cadence,
    parallel: false,
    script: 'yarn sandbox --no-link --no-start --no-publish',
    junit,
  });
}

if (require.main === module) {
  run().catch((err) => {
    logger.error(`🚨 An error occurred when executing "${scriptName}":`);
    logger.error(err);
    process.exit(1);
  });
}
