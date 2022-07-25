import path from 'path';
import { existsSync } from 'fs';

import { getOptionsOrPrompt } from './utils/options';
import type { CLIStep } from './utils/cli-step';
import { executeCLIStep } from './utils/cli-step';

const frameworks = ['react'];
const addons = ['a11y', 'storysource'];

async function getOptions() {
  return getOptionsOrPrompt('yarn example', {
    framework: {
      description: 'Which framework would you like to use?',
      values: frameworks,
      required: true,
    },
    addon: {
      description: 'Which extra addons (beyond the CLI defaults) would you like installed?',
      values: addons,
      multiple: true,
    },
    includeStories: {
      description:
        "Include Storybook's own stories (only applies if a react-based framework is used)?",
    },
    create: {
      description: 'Create the example from scratch (rather than degitting it)?',
    },
    verdaccio: {
      description: 'Use verdaccio rather than yarn linking stories?',
    },
    start: {
      description: 'Start the example app?',
      inverse: true,
    },
    build: {
      description: 'Build the example app?',
    },
    watch: {
      description: 'Start building used packages in watch mode as well as the example app?',
    },
  });
}

const steps: Record<string, CLIStep> = {
  repro: {
    command: 'repro',
    description: 'Bootstrapping example',
    icon: '👷',
    hasArgument: true,
    options: {
      template: { values: frameworks },
      e2e: {},
    },
  },
  add: {
    command: 'add',
    description: 'Adding addon',
    icon: '+',
    hasArgument: true,
    options: {},
  },
  build: {
    command: 'build',
    description: 'Building example',
    icon: '🔨',
    options: {},
  },
  dev: {
    command: 'dev',
    description: 'Starting example',
    icon: '🖥',
    options: {},
  },
};

async function main() {
  const optionValues = await getOptions();
  const examplesDir = path.resolve(__dirname, '../examples');

  const { framework } = optionValues;
  const cwd = path.join(examplesDir, framework as string);

  // TODO -- what to do when the directory already exists?
  if (!existsSync(cwd)) {
    await executeCLIStep(steps.repro, {
      argument: cwd,
      optionValues: { template: framework },
      cwd: examplesDir,
    });

    // TODO -- sb add <addon> doesn't actually work properly:
    //   - installs in `deps` not `devDeps`
    //   - does a `workspace:^` install (what does that mean?)
    //   - doesn't add to `main.js`

    // eslint-disable-next-line no-restricted-syntax
    for (const addon of optionValues.addon as string[]) {
      const addonName = `@storybook/addon-${addon}`;
      // eslint-disable-next-line no-await-in-loop
      await executeCLIStep(steps.add, { argument: addonName, cwd });
    }

    // TODO copy stories
  }

  const { start } = optionValues;
  if (start) {
    await executeCLIStep(steps.dev, { cwd });
  } else {
    await executeCLIStep(steps.build, { cwd });
    // TODO serve
  }

  // TODO start dev
}

main().catch((err) => console.error(err));
