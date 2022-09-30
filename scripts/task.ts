/* eslint-disable no-await-in-loop */
import { AbortController } from 'node-abort-controller';
import { getJunitXml } from 'junit-xml';
import { outputFile } from 'fs-extra';
import { join, resolve } from 'path';
import { prompt } from 'prompts';

import { createOptions, getOptionsOrPrompt, Option, OptionValues } from './utils/options';
import { installRepo } from './tasks/install-repo';
import { bootstrapRepo } from './tasks/bootstrap-repo';
import { publishRepo } from './tasks/publish-repo';
import { runRegistryRepo } from './tasks/run-registry-repo';
import { create } from './tasks/create';
import { install } from './tasks/install';
import { sandbox } from './tasks/sandbox';
import { start } from './tasks/start';
import { smokeTest } from './tasks/smoke-test';
import { build } from './tasks/build';
import { serve } from './tasks/serve';
import { testRunner } from './tasks/test-runner';
import { chromatic } from './tasks/chromatic';
import { e2eTests } from './tasks/e2e-tests';

import TEMPLATES from '../code/lib/cli/src/repro-templates';
import { addons } from './sandbox';

const sandboxDir = resolve(__dirname, '../sandbox');
const codeDir = resolve(__dirname, '../code');
const junitDir = resolve(__dirname, '../code/test-results');

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
   * Which tasks run before this task
   */
  before?: TaskKey[] | ((options: PassedOptionValues) => TaskKey[]);
  /**
   * Is this task already "ready", and potentially not required?
   */
  ready: (details: TemplateDetails) => MaybePromise<boolean>;
  /**
   * Reset the previous version of the task that ran
   * (it may not be necessary if running the task overwrites prior versions)
   */
  reset?: (details: TemplateDetails, options: PassedOptionValues) => MaybePromise<void>;
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
  'run-registry-repo': runRegistryRepo,
  // These tasks pertain to a single sandbox in the ../sandboxes dir
  create,
  install,
  sandbox,
  start,
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
    values: addons,
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
  reset: {
    type: 'string',
    description: 'Which task should we reset back to?',
    values: [...(Object.keys(tasks) as TaskKey[]), 'never', 'as-needed'] as const,
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

  return sortedTasks;
}

type TaskStatus = 'ready' | 'unready' | 'running' | 'complete' | 'failed';
const statusToEmoji: Record<TaskStatus, string> = {
  ready: '🟢',
  unready: '🟡',
  running: '🔄',
  complete: '✅',
  failed: '❌',
};
function writeTaskList(taskAndStatus: [Task, TaskStatus][]) {
  logger.info(
    taskAndStatus
      .map(([task, status]) => `${statusToEmoji[status]} ${getTaskKey(task)}`)
      .join(' > ')
  );
  logger.info();
}

const controllers: AbortController[] = [];

async function runTask(task: Task, details: TemplateDetails, optionValues: PassedOptionValues) {
  const startTime = new Date();
  try {
    const controller = await task.run(details, optionValues);
    if (controller) controllers.push(controller);

    if (details.junitFilename && !task.junit)
      await writeJunitXml(getTaskKey(task), details.key, startTime);

    return controller;
  } catch (err) {
    if (details.junitFilename && !task.junit)
      await writeJunitXml(getTaskKey(task), details.key, startTime, err);

    throw err;
  }
}

async function run() {
  const {
    task: taskKey,
    reset,
    junit,
    ...optionValues
  } = await getOptionsOrPrompt('yarn task', {
    ...sandboxOptions,
    ...runOptions,
    ...taskOptions,
  });

  const task = tasks[taskKey];
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

  const sortedTasks = getTaskList(task, optionValues);
  const sortedTasksReady = await Promise.all(sortedTasks.map((t) => t.ready(details)));
  const firstUnready = sortedTasks.find((_, index) => !sortedTasksReady[index]);

  logger.info(`Task readiness up to ${taskKey}`);
  const sortedTasksStatus: [Task, TaskStatus][] = sortedTasks.map((sortedTask, index) => [
    sortedTask,
    sortedTasksReady[index] ? 'ready' : 'unready',
  ]);
  writeTaskList(sortedTasksStatus);

  let firstTask: Task;
  if (reset === 'as-needed') {
    if (!firstUnready) {
      logger.info('All tasks already ready, no task needed');
      return;
    }

    firstTask = firstUnready;
  } else if (reset === 'never') {
    if (!firstUnready) throw new Error(`Task ${taskKey} is ready`);
    if (firstUnready !== task) throw new Error(`Task ${getTaskKey(firstUnready)} was not ready`);
    firstTask = task;
  } else if (reset) {
    // set to reset back to a specific task
    if (sortedTasks.indexOf(tasks[reset]) > sortedTasks.indexOf(firstUnready)) {
      throw new Error(
        `Task ${getTaskKey(firstUnready)} was not ready, earlier than your request ${reset}.`
      );
    }
    firstTask = tasks[reset];
  } else if (firstUnready === sortedTasks[0]) {
    // We need to do everything, no need to ask
    firstTask = firstUnready;
  } else {
    // We don't know what to do! Let's ask
    ({ firstTask } = await prompt({
      type: 'select',
      message: 'Which task would you like to start at?',
      name: 'firstTask',
      choices: sortedTasks.slice(0, sortedTasks.indexOf(firstUnready) + 1).map((t) => ({
        title: getTaskKey(t),
        value: t,
      })),
    }));
  }

  for (let i = sortedTasks.indexOf(firstTask); i <= sortedTasks.length; i += 1) {
    sortedTasksStatus[i][1] = 'running';
    writeTaskList(sortedTasksStatus);
    const taskController = await runTask(sortedTasks[i], details, optionValues);
    sortedTasksStatus[i][1] = 'complete';

    // If the task has it's own controller, it is going to remain
    // open until the user ctrl-c's which will have the side effect
    // of stopping everything.
    if (sortedTasks[i] === task && taskController) {
      await new Promise(() => {});
    }
  }

  // TODO -- is this necessary??

  // // If the task has it's own controller, it is going to remain
  // // open until the user ctrl-c's which will have the side effect
  // // of stopping everything.
  // if (taskController) {
  //   await new Promise(() => {});
  // } else {
  //   controllers.forEach((c) => c.abort());
  // }
}

if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error();
      logger.error(err.message);
      // logger.error(err);
      process.exit(1);
    });
}
