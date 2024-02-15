import path, { relative } from 'path';
import type { StorybookConfig } from '@storybook/types';
import { serverRequire, serverResolve } from './interpret-require';
import { validateConfigurationFiles } from './validate-configuration-files';
import { readFile } from 'fs/promises';
import chalk from 'chalk';

export async function loadMainConfig({
  configDir = '.storybook',
  noCache = false,
}: {
  configDir: string;
  noCache?: boolean;
}): Promise<StorybookConfig> {
  await validateConfigurationFiles(configDir);

  const mainJsPath = serverResolve(path.resolve(configDir, 'main')) as string;

  if (noCache && mainJsPath && require.cache[mainJsPath]) {
    delete require.cache[mainJsPath];
  }

  try {
    const out = await serverRequire(mainJsPath);
    return out;
  } catch (e) {
    if (!(e instanceof Error)) {
      throw e;
    }
    if (e.message.match(/Cannot use import statement outside a module/)) {
      const location = relative(process.cwd(), mainJsPath);
      const line = e.stack?.match(new RegExp(`${location}:(\\d+):(\\d+)`))?.[1];
      const message = [
        `Storybook failed to load ${location}..`,
        '',
        `It looks like the file tried to load/import an ESM only module.`,
        `Support for this is currently limited in ${location}.`,
        `You can import ESM modules in your main file, but only as dynamic import.`,
        '',
      ];

      if (line) {
        const contents = await readFile(mainJsPath, 'utf-8');
        const lines = contents.split('\n');
        const num = parseInt(line, 10) - 1;

        message.push(
          chalk.white(
            `In your ${chalk.yellow(location)} file, this line threw an error: ${chalk.bold.cyan(
              num
            )}, which looks like this:`
          ),
          chalk.grey(lines[num])
        );
      }
      message.push(
        '',
        chalk.white(`Convert the dynamic import to an dynamic import where they are used.`),
        chalk.white(`Example:`) + ' ' + chalk.gray(`await import(<your ESM only module>);`)
      );

      const out = new Error(message.join('\n'));

      delete out.stack;

      throw out;
    }
    throw e;
    //
  }
}
