import { basename, resolve } from 'path';
import { createOptions, getOptionsOrPrompt } from './utils/options';
import { options as oncePerTemplateOptions, oncePerTemplate } from './once-per-template';

const scriptName = basename(__filename, 'ts');
const codeDir = resolve(__dirname, '../code');
const logger = console;

export const options = createOptions({
  cadence: oncePerTemplateOptions.cadence,
  junit: oncePerTemplateOptions.junit,
});

async function run() {
  const { cadence, junit } = await getOptionsOrPrompt(`yarn ${scriptName}`, options);

  function getReporters(template: string) {
    const filename = resolve(codeDir, junit);
    return `reporters: [ 'default', [ 'jest-junit', { outputDirectory: '${filename}', addFileAttribute: 'true', usePathForSuiteName: 'true',uniqueOutputName: 'true' }, ], ],`;
  }

  function jestConfig(template: string) {
    return (
      // eslint-disable-next-line prefer-template
      `const { getJestConfig } = require('@storybook/test-runner'); ` +
      `module.exports = { ` +
      `...getJestConfig(),` +
      getReporters(template) +
      `}`
    );
  }

  await oncePerTemplate({
    step: 'Installing Test Runner',
    cd: true,
    cadence,
    parallel: true,
    junit: undefined,
    scriptName: 'test-storybook',
    templateCommand: (template) => [
      `yarn add --dev @storybook/test-runner jest-junit`,
      `echo "${jestConfig(template)}" > test-runner-jest.config.js`,
    ],
  });

  return oncePerTemplate({
    step: 'Running Test Runner',
    cd: true,
    cadence,
    parallel: false,
    junit: undefined,
    scriptName: 'test-storybook',
    templateCommand: (template) =>
      `yarn test-storybook --url ${`http://localhost:8001/${template.replace('/', '-')}/`}`,
  });
}

if (require.main === module) {
  run().catch((err) => {
    logger.error(`🚨 An error occurred when executing "${scriptName}":`);
    logger.error(err);
    process.exit(1);
  });
}
