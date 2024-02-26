import camelCase from 'lodash/camelCase.js';
import upperFirst from 'lodash/upperFirst.js';
import type { Options } from 'prettier';

const logger = console;

export const sanitizeName = (name: string) => {
  let key = upperFirst(camelCase(name));
  // prepend _ if name starts with a digit
  if (/^\d/.test(key)) {
    key = `_${key}`;
  }
  // prepend _ if name starts with a digit
  if (/^\d/.test(key)) {
    key = `_${key}`;
  }
  return key;
};

export function jscodeshiftToPrettierParser(parser?: string) {
  const parserMap: Record<string, string> = {
    babylon: 'babel',
    flow: 'flow',
    ts: 'typescript',
    tsx: 'typescript',
  };

  if (!parser) {
    return 'babel';
  }
  return parserMap[parser] || 'babel';
}

/**
 * Formats the code using prettier, but aborts if it takes too long and returns the original code.
 * @param code The code to format
 * @param codePath The path of the code
 * @param prettierConfig The prettier configuration @default {}
 * @param timeout The timeout in milliseconds @default 4000
 */
export function abortablePrettierFormat(
  code: string,
  codePath: string,
  prettierConfig: Options = {},
  timeout = 4000
): Promise<string> {
  let finished = false;
  return Promise.race([
    new Promise<string>(async (resolve) => {
      try {
        const prettier = await import('prettier');
        const output = await prettier.format(code, {
          ...(await prettier.resolveConfig(codePath)),
          ...prettierConfig,
          filepath: codePath,
        });
        resolve(output);
      } catch (e) {
        logger.log(`Failed applying prettier to ${codePath}.`);
        resolve(code);
      } finally {
        finished = true;
      }
    }),
    new Promise<string>((resolve) => {
      setTimeout(() => {
        if (finished) return;
        logger.log(`Prettier is taking a long time, skipping formatting for ${codePath}`);
        resolve(code);
      }, timeout);
    }),
  ]);
}
