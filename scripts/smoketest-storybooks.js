import { promisify } from 'util';
import { readdir as readdirRaw, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import program from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import { outputFile } from 'fs-extra';
import execa from 'execa';
import { getJunitXml } from 'junit-xml';

import { getDeployables } from './utils/list-examples';
import { filterDataForCurrentCircleCINode } from './utils/concurrency';

program
  .option(
    '--skip <value>',
    'Skip an example, accepts multiple values like "--skip vue-kitchen-sink official-storybook"',
    (value, previous) => previous.concat([value]),
    []
  )
  .option('--all', `run e2e tests for every example`, false)
  .option('--junit <path>', `output junit.xml test results to <path>`);
program.parse(process.argv);

const {
  all: shouldRunAllExamples,
  args: exampleArgs,
  skip: examplesToSkip,
  junit: junitPath,
} = program;

const readdir = promisify(readdirRaw);

const p = (l) => join(__dirname, '..', 'code', ...l);
const logger = console;

// TODO think if this filter is what we want for smoke tests
const hasBuildScript = (l) => {
  const text = readFileSync(l, 'utf8');
  const json = JSON.parse(text);

  return !!json.scripts['build-storybook'];
};

const handleExamples = async (deployables) =>
  deployables.reduce(async (acc, d) => {
    const results = await acc;

    logger.log('');
    logger.log(`------------------${Array(d.length).fill('-').join('')}`);
    logger.log(`▶️  smoke-testing: ${d}`);
    logger.log(`------------------${Array(d.length).fill('-').join('')}`);
    const cwd = p(['examples', d]);

    // ensure web-components example works, because it's outside the yarn workspace
    if (existsSync(join(cwd, 'yarn.lock'))) {
      await execa(`yarn`, [`install`], { cwd });
    }

    const start = new Date();
    const result = { example: d, timestamp: start };
    try {
      const { all } = await execa(`yarn`, ['storybook', '--smoke-test', '--quiet'], { cwd });

      logger.log(`----------${Array(d.length).fill('-').join('')}`);
      logger.log(`✅ ${d} passed`);
      logger.log(`----------${Array(d.length).fill('-').join('')}`);

      return [...results, { ...result, time: (new Date() - start) / 1000, ok: true, output: all }];
    } catch (err) {
      return [...results, { ...result, time: (new Date() - start) / 1000, ok: false, err }];
    }
  }, Promise.resolve([]));

const run = async () => {
  const allExamples = await readdir(p(['examples']));

  // if a specific example is passed, use it. Else use all
  let examplesToBuild =
    exampleArgs.length > 0
      ? exampleArgs
      : allExamples.filter((example) => !example.includes('README'));

  if (examplesToSkip.length > 0) {
    logger.log(`⏭  Will skip the following examples: ${chalk.yellow(examplesToSkip.join(', '))}`);
    examplesToBuild = examplesToBuild.filter((example) => !examplesToSkip.includes(example));
  }

  if (!shouldRunAllExamples && exampleArgs.length === 0) {
    const { selectedExamples } = await prompts([
      {
        type: 'autocompleteMultiselect',
        message: 'Select the examples to smoke-test',
        name: 'selectedExamples',
        min: 1,
        hint: 'You can also run directly with example name like `yarn smoketest-storybooks official-example`, or `yarn smoketest-storybooks --all` for all examples!',
        choices: examplesToBuild.map((exampleName) => {
          return {
            value: exampleName,
            title: exampleName,
            selected: false,
          };
        }),
      },
    ]);
    examplesToBuild = selectedExamples;
  }

  const list = getDeployables(examplesToBuild, hasBuildScript);
  const deployables = filterDataForCurrentCircleCINode(list);

  if (deployables.length) {
    logger.log(`🏗  Will smoke test: ${chalk.cyan(deployables.join(', '))}`);
    const s = new Date();
    const results = await handleExamples(deployables);

    if (junitPath) {
      const junitXml = getJunitXml({
        time: (Date.now() - s) / 1000,
        name: 'Storybook Smoke Tests',
        suites: results.map(({ example, timestamp, time, ok, err, output }) => ({
          name: example,
          timestamp,
          time,
          testCases: [
            {
              name: 'Start',
              assertions: 1,
              time,
              systemOut: output,
              ...(!ok && {
                errors: [err],
              }),
            },
          ],
        })),
      });
      await outputFile(junitPath, junitXml);
    }

    const failures = results.filter((r) => !r.ok);
    if (failures.length > 0) {
      console.log(`SMOKE TESTS FAILED:`);

      failures.forEach(({ example, err, output }) => {
        console.log(`${example} failed:`);
        console.log();
        console.log(err.message);
        console.log('==========================================');
      });

      process.exit(1);
    }
    console.log('All smoke tests succeeded!');
  }
};

run().catch((e) => {
  logger.error(e);
  process.exit(1);
});
