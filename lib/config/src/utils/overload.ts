import { EnvOptions, CliOptions, CallOptions } from '../types/cli';

// { envOptions: { NODE_ENV: 'development', SB_PORT: NaN },
//   cliOptions:
//    { configDir: './',
//      port: 9011,
//      staticDir: [ 'built-storybooks' ] },
//   callOptions:
//    { frameworkPresets:
//       [ '/Users/dev/Projects/GitHub/storybook/core/app/react/dist/server/framework-preset-react.js',
//         '/Users/dev/Projects/GitHub/storybook/core/app/react/dist/server/framework-preset-cra.js',
//         '/Users/dev/Projects/GitHub/storybook/core/app/react/dist/server/framework-preset-react-docgen.js' ] } }

export const createOverloadPreset = async (
  envOptions: EnvOptions,
  cliOptions: CliOptions,
  callOptions: CallOptions
) => {
  return { code: '' };
};
