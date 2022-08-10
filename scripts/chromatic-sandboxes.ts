import { basename, join, resolve } from 'path';
import { createOptions, getOptionsOrPrompt } from './utils/options';
import { oncePerTemplate } from './once-per-template';

const scriptName = basename(__filename, 'ts');
const codeDir = resolve(__dirname, '../code');
const builtDir = resolve(__dirname, '../built-sandboxes');
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
    step: 'Running Chromatic',
    cd: false,
    cadence,
    parallel: false,
    junit: undefined,
    scriptName: 'chromatic',
    templateCommand: (template) => ({
      command: [
        `npx chromatic`,
        `--storybook-build-dir=${join(builtDir, template.replace('/', '-'))}`,
        `--junit-report=${resolve(
          codeDir,
          junit.replace('.xml', `-${template.replace('/', '-')}.xml`)
        )}`,
      ].join(' '),
      execaOptions: {
        env: {
          CHROMATIC_PROJECT_TOKEN:
            process.env[`CHROMATIC_TOKEN_${template.toUpperCase().replace(/\/|-/g, '_')}`],
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
