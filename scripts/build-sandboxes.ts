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
});

async function run() {
  const { cadence } = await getOptionsOrPrompt(`yarn ${scriptName}`, options);

  await ensureDir(sandboxDir);
  return oncePerTemplate({
    cadence,
    parallel: true,
    script: 'yarn sandbox --no-link --no-start --no-publish',
  });
}

if (require.main === module) {
  run().catch((err) => {
    logger.error(`🚨 An error occurred when executing "${scriptName}":`);
    logger.error(err);
    process.exit(1);
  });
}
