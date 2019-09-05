import { resolveConfig, Options } from 'prettier';

const fromStorybook: Options = {
  printWidth: 100,
  tabWidth: 2,
  bracketSpacing: true,
  trailingComma: 'es5',
  singleQuote: true,
};

export const resolvePrettierConfig = async (file: string) => {
  const fromPrettier = await resolveConfig(file);

  return fromPrettier || fromStorybook;
};
