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
      const a = relative(process.cwd(), mainJsPath);
      const line = e.stack?.match(new RegExp(`${a}:(\\d+):(\\d+)`))?.[1];
      const message = [
        `Storybook failed to load ${a}..`,
        '',
        `It looks like the file tried to load/import an ESM only module.`,
        `Support for this is currently limited in ${a}.`,
        `You can import ESM modules in your main file, but only as imperative imports.`,
        '',
      ];

      if (line) {
        const contents = await readFile(mainJsPath, 'utf-8');
        const lines = contents.split('\n');
        const num = parseInt(line, 10) - 1;

        message.push(
          chalk.white(
            `In your ${chalk.yellow(a)} file, this line threw an error: ${chalk.bold.cyan(
              num
            )}, which looks like this:`
          ),
          chalk.grey(lines[num])
        );
      }
      message.push(
        '',
        `Convert the declarative import to an imperative import where they are used.`
      );

      const out = new Error(message.join('\n'));

      delete out.stack;

      throw out;
    }
    throw e;
    //
  }
}
