import { promisify } from 'util';
import { readdir as readdirRaw, writeFile as writeFileRaw, readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import program from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import execa from 'execa';
import { getJunitXml } from 'junit-xml';

import { getDeployables } from './utils/list-examples';
import { filterDataForCurrentCircleCINode } from './utils/concurrency';
import { outputFile } from 'fs-extra';

program
  .option(
    '--skip <value>',
    'Skip an example, accepts multiple values like "--skip vue-kitchen-sink official-storybook"',
    (value, previous) => previous.concat([value]),
    []
  )
  .option('--junit <path>', `output junit.xml test results to <path>`)
  .option('--all', `run e2e tests for every example`, false);
program.parse(process.argv);

const {
  all: shouldRunAllExamples,
  args: exampleArgs,
  skip: examplesToSkip,
  junit: junitPath,
} = program;

const readdir = promisify(readdirRaw);
const writeFile = promisify(writeFileRaw);

const p = (l) => join(__dirname, '..', 'code', ...l);
const logger = console;

const hasBuildScript = (l) => {
  const text = readFileSync(l, 'utf8');
  const json = JSON.parse(text);

  return !!json.scripts['build-storybook'];
};

const createContent = (deployables) => {
  return `
    <style>
      body {
        background: black;
        color: white;
      }
      #frame {
        position: absolute;
        left: 0;
        right: 0;
        width: 100vw;
        height: calc(100vh - 30px);
        bottom: 0;
        top: 30px;
        border: 0 none;
        margin: 0;
        padding: 0;
      }
      #select {
        position: absolute;
        top: 0;
        right: 100px;
        left: 10px;
        height: 30px;
        width: calc(100vw - 120px);
        background: black;
        color: white;
        border: 0 none;
        border-radius: 0;
        padding: 10px;
        box-sizing: border-box;
      }
      #open {
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 30px;
        background: black;
        color: white;
        border: 0 none;
        border-radius: 0;
        padding: 10px;
        box-sizing: border-box;
      }
    </style>

    <script>
      function handleClick() {
        var value = document.getElementById("select").value;
        window.location = document.location.origin + value;
      }
      function handleSelect() {
        var value = document.getElementById("select").value;
        var frame = document.getElementById("frame");

        sessionStorage.clear();
        localStorage.clear();

        frame.setAttribute('src', value);
      }
    </script>

    <button id="open" onclick="handleClick()">open</button>

    <select id="select" onchange="handleSelect()">
      ${deployables.map((i) => `<option value="/${i}/">${i}</option>`).join('\n')}
    </select>

    <iframe id="frame" src="/${deployables[0]}/" />
  `;
};

const handleExamples = async (deployables) =>
  deployables.reduce(async (acc, d) => {
    const results = await acc;

    logger.log('');
    logger.log(`-----------------${Array(d.length).fill('-').join('')}`);
    logger.log(`▶️  building: ${d}`);
    logger.log(`-----------------${Array(d.length).fill('-').join('')}`);
    const out = p(['built-storybooks', d]);
    const cwd = p(['examples', d]);
    const execaOptions = { cwd, shell: true };

    if (existsSync(join(cwd, 'yarn.lock'))) {
      await execa(`yarn`, [`install`], execaOptions);
    }

    const start = new Date();
    const result = { example: d, timestamp: start };
    try {
      const { all } = await execa(
        `yarn`,
        [`build-storybook`, `--output-dir=${out}`, '--quiet'],
        execaOptions
      );

      // If the example uses `storyStoreV7` or `buildStoriesJson`, stories.json already exists
      // It can fail on local machines if puppeteer fails to install, that's not critical, it will work without it
      if (!existsSync(`${out}/stories.json`)) {
        await execa(`npx`, [`sb`, 'extract', out, `${out}/stories.json`], execaOptions).catch(
          () => {}
        );
      }

      logger.log('-------');
      logger.log(`✅ ${d} built`);
      logger.log('-------');

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
        message: 'Select the examples to build',
        name: 'selectedExamples',
        min: 1,
        hint: 'You can also run directly with example name like `yarn build-storybooks official-example`, or `yarn build-storybooks --all` for all examples!',
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
    logger.log(`🏗  Will build Storybook for: ${chalk.cyan(deployables.join(', '))}`);

    const start = new Date();
    const results = await handleExamples(deployables);

    if (junitPath) {
      const junitXml = getJunitXml({
        time: (Date.now() - start) / 1000,
        name: 'Build Storybooks',
        suites: results.map(({ example, timestamp, time, ok, err, output }) => ({
          name: example,
          timestamp,
          time,
          testCases: [
            {
              name: `Build ${example}`,
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
      logger.log(`Test results written to ${resolve(junitPath)}`);
    }

    const failures = results.filter((r) => !r.ok);
    if (failures.length > 0) {
      logger.log(`BUILDING STORYBOOKS FAILED:`);

      failures.forEach(({ example, err, output }) => {
        logger.log(`${example} failed:`);
        logger.log();
        logger.log(err.message);
        logger.log('==========================================');
      });

      process.exit(1);
    }
    logger.log('All Storybooks built!');
  }

  if (
    deployables.length &&
    (process.env.CIRCLE_NODE_INDEX === undefined ||
      process.env.CIRCLE_NODE_INDEX === '0' ||
      process.env.CIRCLE_NODE_INDEX === 0)
  ) {
    const indexLocation = p(['built-storybooks', 'index.html']);
    logger.log('');
    logger.log(`📑 creating index at: ${indexLocation}`);
    logger.log('');
    await writeFile(indexLocation, createContent(deployables));

    logger.log('-------');
    logger.log('✅ done');
    logger.log('-------');
  }
};

run().catch((e) => {
  logger.error(e);
  process.exit(1);
});
