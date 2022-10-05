/* eslint-disable no-await-in-loop */
import { AbortController } from 'node-abort-controller';
import { getJunitXml } from 'junit-xml';
import { outputFile, existsSync, readFile } from 'fs-extra';
import { join, resolve } from 'path';
import { prompt } from 'prompts';
import boxen from 'boxen';
import { dedent } from 'ts-dedent';

import { createOptions, getCommand, getOptionsOrPrompt, OptionValues } from './utils/options';
import { installRepo } from './tasks/install-repo';
import { bootstrapRepo } from './tasks/bootstrap-repo';
import { publishRepo } from './tasks/publish-repo';
import { registryRepo } from './tasks/registry-repo';
import { sandbox } from './tasks/sandbox';
import { dev } from './tasks/dev';
import { smokeTest } from './tasks/smoke-test';
import { build } from './tasks/build';
import { serve } from './tasks/serve';
import { testRunner } from './tasks/test-runner';
import { chromatic } from './tasks/chromatic';
import { e2eTests } from './tasks/e2e-tests';

import TEMPLATES from '../code/lib/cli/src/repro-templates';

const sandboxDir = resolve(__dirname, '../sandbox');
const codeDir = resolve(__dirname, '../code');
const junitDir = resolve(__dirname, '../code/test-results');

export const extraAddons = ['a11y', 'storysource'];
export const defaultAddons = [
  'a11y',
  'actions',
  'backgrounds',
  'controls',
  'docs',
  'highlight',
  'interactions',
  'links',
  'measure',
  'outline',
  'toolbars',
  'viewport',
];

export type TemplateKey = keyof typeof TEMPLATES;
export type Template = typeof TEMPLATES[TemplateKey];
export type Path = string;
export type TemplateDetails = {
  key: TemplateKey;
  template: Template;
  codeDir: Path;
  sandboxDir: Path;
  builtSandboxDir: Path;
  junitFilename: Path;
};

type MaybePromise<T> = T | Promise<T>;

export type Task = {
  /**
   * Does this task represent a service for another task?
   *
   * Unlink other tasks, if a service is not ready, it doesn't mean the subsequent tasks
   * must be out of date. As such, services will never be reset back to, although they
   * will be started if dependent tasks are.
   */
  service?: boolean;
  /**
   * Which tasks run before this task
   */
  before?: TaskKey[] | ((options: PassedOptionValues) => TaskKey[]);
  /**
   * Is this task already "ready", and potentially not required?
   */
  ready: (details: TemplateDetails, options: PassedOptionValues) => MaybePromise<boolean>;
  /**
   * Run the task
   */
  run: (
    details: TemplateDetails,
    options: PassedOptionValues
  ) => MaybePromise<void | AbortController>;
  /**
   * Does this task handle its own junit results?
   */
  junit?: boolean;
};

export const tasks = {
  // These tasks pertain to the whole monorepo, rather than an
  // individual template/sandbox
  'install-repo': installRepo,
  'bootstrap-repo': bootstrapRepo,
  'publish-repo': publishRepo,
  'registry-repo': registryRepo,
  // These tasks pertain to a single sandbox in the ../sandboxes dir
  sandbox,
  dev,
  'smoke-test': smokeTest,
  build,
  serve,
  'test-runner': testRunner,
  chromatic,
  'e2e-tests': e2eTests,
};

type TaskKey = keyof typeof tasks;

export const sandboxOptions = createOptions({
  template: {
    type: 'string',
    description: 'What template are you running against?',
    values: Object.keys(TEMPLATES) as TemplateKey[],
  },
  // TODO -- feature flags
  sandboxDir: {
    type: 'string',
    description: 'What is the name of the directory the sandbox runs in?',
    promptType: false,
  },
  addon: {
    type: 'string[]',
    description: 'Which extra addons (beyond the CLI defaults) would you like installed?',
    values: extraAddons,
  },
});

export const runOptions = createOptions({
  link: {
    type: 'boolean',
    description: 'Link the storybook to the local code?',
    inverse: true,
  },
  fromLocalRepro: {
    type: 'boolean',
    description: 'Create the template from a local repro (rather than degitting it)?',
  },
  dryRun: {
    type: 'boolean',
    description: "Don't execute commands, just list them (dry run)?",
    promptType: false,
  },
  debug: {
    type: 'boolean',
    description: 'Print all the logs to the console',
    promptType: false,
  },
});

export const taskOptions = createOptions({
  task: {
    type: 'string',
    description: 'What task are you performing (corresponds to CI job)?',
    values: Object.keys(tasks) as TaskKey[],
    required: true,
  },
  startFrom: {
    type: 'string',
    description: 'Which task should we reset back to?',
    values: [...(Object.keys(tasks) as TaskKey[]), 'never', 'auto'] as const,
  },
  junit: {
    type: 'boolean',
    description: 'Store results in junit format?',
  },
});

type PassedOptionValues = OptionValues<typeof sandboxOptions & typeof runOptions>;

const logger = console;

function getJunitFilename(taskKey: TaskKey) {
  return join(junitDir, `${taskKey}.xml`);
}

async function writeJunitXml(
  taskKey: TaskKey,
  templateKey: TemplateKey,
  startTime: Date,
  err?: Error
) {
  const name = `${taskKey} - ${templateKey}`;
  const time = (Date.now() - +startTime) / 1000;
  const testCase = { name, assertions: 1, time, ...(err && { errors: [err] }) };
  const suite = { name, timestamp: startTime, time, testCases: [testCase] };
  const junitXml = getJunitXml({ time, name, suites: [suite] });
  const path = getJunitFilename(taskKey);
  await outputFile(path, junitXml);
  logger.log(`Test results written to ${resolve(path)}`);
}

function getTaskKey(task: Task): TaskKey {
  return (Object.entries(tasks) as [TaskKey, Task][]).find(([_, t]) => t === task)[0];
}

/**
 *
 * Get a list of tasks that need to be (possibly) run, in order, to
 * be able to run `finalTask`.
 */
function getTaskList(finalTask: Task, optionValues: PassedOptionValues) {
  const taskDeps = new Map<Task, Task[]>();
  // Which tasks depend on a given task
  const tasksThatDepend = new Map<Task, Task[]>();

  const addTask = (task: Task, dependent?: Task) => {
    if (tasksThatDepend.has(task)) {
      if (!dependent) throw new Error('Unexpected task without dependent seen a second time');
      tasksThatDepend.set(task, tasksThatDepend.get(task).concat(dependent));
      return;
    }

    // This is the first time we've seen this task
    tasksThatDepend.set(task, dependent ? [dependent] : []);

    const beforeTaskNames =
      typeof task.before === 'function' ? task.before(optionValues) : task.before || [];
    const beforeTasks = beforeTaskNames.map((n) => tasks[n]);
    taskDeps.set(task, beforeTasks);

    beforeTasks.forEach((t) => addTask(t, task));
  };
  addTask(finalTask);

  // We need to sort the tasks topologically so we run each task before the tasks that
  // depend on it. This is Kahn's algorithm :shrug:
  const sortedTasks = [] as Task[];
  const tasksWithoutDependencies = [finalTask];

  while (taskDeps.size !== sortedTasks.length) {
    const task = tasksWithoutDependencies.pop();
    if (!task) throw new Error('Topological sort failed, is there a cyclic task dependency?');

    sortedTasks.unshift(task);
    taskDeps.get(task).forEach((depTask) => {
      const remainingTasksThatDepend = tasksThatDepend
        .get(depTask)
        .filter((t) => !sortedTasks.includes(t));
      if (remainingTasksThatDepend.length === 0) tasksWithoutDependencies.push(depTask);
    });
  }

  return { sortedTasks, tasksThatDepend };
}

type TaskStatus =
  | 'ready'
  | 'unready'
  | 'running'
  | 'complete'
  | 'failed'
  | 'serving'
  | 'notserving';
const statusToEmoji: Record<TaskStatus, string> = {
  ready: '🟢',
  unready: '🟡',
  running: '🔄',
  complete: '✅',
  failed: '❌',
  serving: '🔊',
  notserving: '🔇',
};
function writeTaskList(statusMap: Map<Task, TaskStatus>) {
  logger.info(
    [...statusMap.entries()]
      .map(([task, status]) => `${statusToEmoji[status]} ${getTaskKey(task)}`)
      .join(' > ')
  );
  logger.info();
}

async function runTask(task: Task, details: TemplateDetails, optionValues: PassedOptionValues) {
  const startTime = new Date();
  try {
    await task.run(details, optionValues);

    if (details.junitFilename && !task.junit)
      await writeJunitXml(getTaskKey(task), details.key, startTime);
  } catch (err) {
    if (details.junitFilename && !task.junit)
      await writeJunitXml(getTaskKey(task), details.key, startTime, err);

    throw err;
  } finally {
    const { junitFilename } = details;
    if (existsSync(junitFilename)) {
      const junitXml = await (await readFile(junitFilename)).toString();
      const prefixedXml = junitXml.replace(/classname="(.*)"/g, `classname="${details.key} $1"`);
      await outputFile(junitFilename, prefixedXml);
    }
  }
}

async function run() {
  const allOptions = {
    ...sandboxOptions,
    ...runOptions,
    ...taskOptions,
  };
  const allOptionValues = await getOptionsOrPrompt('yarn task', allOptions);

  const { task: taskKey, startFrom, junit, ...optionValues } = allOptionValues;

  const finalTask = tasks[taskKey];
  const { template: templateKey } = optionValues;
  const template = TEMPLATES[templateKey];
  const templateSandboxDir = templateKey && join(sandboxDir, templateKey.replace('/', '-'));
  const details = {
    key: templateKey,
    template,
    codeDir,
    sandboxDir: templateSandboxDir,
    builtSandboxDir: templateKey && join(templateSandboxDir, 'storybook-static'),
    junitFilename: junit && getJunitFilename(taskKey),
  };

  const { sortedTasks, tasksThatDepend } = getTaskList(finalTask, optionValues);
  const sortedTasksReady = await Promise.all(
    sortedTasks.map((t) => t.ready(details, optionValues))
  );

  logger.info(`Task readiness up to ${taskKey}`);
  const initialTaskStatus = (task: Task, ready: boolean) => {
    if (task.service) {
      return ready ? 'serving' : 'notserving';
    }
    return ready ? 'ready' : 'unready';
  };
  const statuses = new Map<Task, TaskStatus>(
    sortedTasks.map((task, index) => [task, initialTaskStatus(task, sortedTasksReady[index])])
  );
  writeTaskList(statuses);

  function setUnready(task: Task) {
    if (task.service) throw new Error(`Cannot set service ${getTaskKey(task)} to unready`);

    statuses.set(task, 'unready');
    tasksThatDepend
      .get(task)
      .filter((t) => !t.service)
      .forEach(setUnready);
  }

  // NOTE: we don't include services in the first unready task. We only need to rewind back to a
  // service if the user explicitly asks. It's expected that a service is no longer running.
  const firstUnready = sortedTasks.find((task) => statuses.get(task) === 'unready');
  if (startFrom === 'auto') {
    // Don't reset anything!
  } else if (startFrom === 'never') {
    if (!firstUnready) throw new Error(`Task ${taskKey} is ready`);
    if (firstUnready !== finalTask)
      throw new Error(`Task ${getTaskKey(firstUnready)} was not ready`);
  } else if (startFrom) {
    // set to reset back to a specific task
    if (sortedTasks.indexOf(tasks[startFrom]) > sortedTasks.indexOf(firstUnready)) {
      throw new Error(
        `Task ${getTaskKey(firstUnready)} was not ready, earlier than your request ${startFrom}.`
      );
    }
    if (tasks[startFrom].service)
      throw new Error(`You cannot start from a service task: ${getTaskKey(tasks[startFrom])}`);
    setUnready(tasks[startFrom]);
  } else if (firstUnready === sortedTasks[0]) {
    // We need to do everything, no need to change anything
  } else {
    // We don't know what to do! Let's ask
    const { startFromTask } = await prompt({
      type: 'select',
      message: 'Which task would you like to start from?',
      name: 'startFromTask',
      choices: sortedTasks
        .slice(0, sortedTasks.indexOf(firstUnready) + 1)
        .filter((t) => !t.service)
        .reverse()
        .map((t) => ({
          title: getTaskKey(t),
          value: t,
        })),
    });
    setUnready(startFromTask);
  }

  for (let i = 0; i < sortedTasks.length; i += 1) {
    const task = sortedTasks[i];
    const status = statuses.get(task);

    if (
      status === 'unready' ||
      (status === 'notserving' &&
        tasksThatDepend.get(task).find((t) => statuses.get(t) === 'unready'))
    ) {
      statuses.set(task, 'running');
      writeTaskList(statuses);

      try {
        await runTask(task, details, {
          ...optionValues,
          // Always debug the final task so we can see it's output fully
          debug: sortedTasks[i] === finalTask ? true : optionValues.debug,
        });
      } catch (err) {
        logger.error(`Error running task ${getTaskKey(task)}:`);
        logger.error();
        logger.error(err);

        if (process.env.CI) {
          logger.error(
            boxen(
              dedent`
                To reproduce this error locally, run:

                  ${getCommand('yarn task', allOptions, {
                    ...allOptionValues,
                    link: true,
                    startFrom: 'auto',
                  })}
                
                Note this uses locally linking which in rare cases behaves differently to CI. For a closer match, run:
                
                  ${getCommand('yarn task', allOptions, {
                    ...allOptionValues,
                    startFrom: 'auto',
                  })}`,
              { borderStyle: 'round', padding: 1, borderColor: '#F1618C' } as any
            )
          );
        }

        return 1;
      }
      statuses.set(task, task.service ? 'serving' : 'complete');

      // If the task is a service, we want to stay open until we are ctrl-ced
      if (sortedTasks[i] === finalTask && finalTask.service) {
        await new Promise(() => {});
      }
    }
  }

  return 0;
}

if (require.main === module) {
  run()
    .then((status) => process.exit(status))
    .catch((err) => {
      logger.error();
      logger.error(err);
      process.exit(1);
    });
}
