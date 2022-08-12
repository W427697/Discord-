/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { join, resolve } from 'path';

import { createOptions, getOptionsOrPrompt } from './utils/options';
import { create } from './tasks/create';
import { publish } from './tasks/publish';
import { bootstrap } from './tasks/bootstrap';

import TEMPLATES from '../code/lib/cli/src/repro-templates';

const sandboxDir = resolve(__dirname, '../sandbox');

export type TemplateKey = keyof typeof TEMPLATES;
export type Template = typeof TEMPLATES[TemplateKey];
export type Path = string;
export type TemplateDetails = { template: Template; sandboxDir: Path };

type MaybePromise<T> = T | Promise<T>;

export type Task = {
  before?: TaskKey[];
  /**
   * Is this task already "ready", and potentially not required?
   */
  ready: (templateKey: TemplateKey, details: TemplateDetails) => MaybePromise<boolean>;
  /**
   * Run the task
   */
  run: (templateKey: TemplateKey, details: TemplateDetails) => MaybePromise<void>;
};

export const tasks = {
  bootstrap,
  publish,
  create,
};

type TaskKey = keyof typeof tasks;

export const options = createOptions({
  task: {
    type: 'string',
    values: Object.keys(tasks) as TaskKey[],
    description: 'What task are you performing (corresponds to CI job)?',
    required: true,
  },
  template: {
    type: 'string',
    values: Object.keys(TEMPLATES) as TemplateKey[],
    description: 'What template are you running against?',
    required: true,
  },
});

const logger = console;

async function runTask(taskKey: TaskKey, templateKey: TemplateKey) {
  const task = tasks[taskKey];
  const template = TEMPLATES[templateKey];
  const templateSandboxDir = join(sandboxDir, templateKey.replace('/', '-'));
  const details = { template, sandboxDir: templateSandboxDir };

  if (await task.ready(templateKey, details)) {
    logger.debug(`✅ ${taskKey} task not required!`);
    return;
  }

  if (task.before?.length > 0) {
    for (const beforeKey of task.before) {
      await runTask(beforeKey, templateKey);
    }
  }

  await task.run(templateKey, { template, sandboxDir: templateSandboxDir });
}

async function run() {
  const { task: taskKey, template: templateKey } = await getOptionsOrPrompt('yarn task', options);

  return runTask(taskKey, templateKey);
}

if (require.main === module) {
  run().catch((err) => {
    logger.error(`🚨 An error occurred when executing task:`);
    logger.error(err);
    process.exit(1);
  });
}
