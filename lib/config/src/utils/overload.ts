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

// export interface Server {
//   port: number;
//   host: string;
//   devPorts: {
//     manager: number;
//     preview: number;
//   };
//   ssl?: {
//     ca: string[];
//     cert: string;
//     key: string;
//   };
//   middleware?: Middleware | Middleware[];
//   static?: Static[];
// }

export const createOverloadPreset = async (
  envOptions: EnvOptions,
  cliOptions: CliOptions,
  callOptions: CallOptions
) => {
  const { overridePresets, frameworkPresets, middleware } = callOptions;

  if (middleware) {
    throw new Error('Please do not use callOptions.middleware, make a preset');
  }

  let code = '';

  // if (
  //   (frameworkPresets && frameworkPresets.length) ||
  //   (overridePresets && overridePresets.length)
  // ) {
  //   code += `
  //     export const presets = ${JSON.stringify(
  //       []
  //         .concat(frameworkPresets || [])
  //         .concat(overridePresets)
  //         .filter(Boolean)
  //     )};
  //   `;
  // }

  if (envOptions.SB_PORT || cliOptions.port || cliOptions.staticDir) {
    code += `
      export const server = base => ({
        ...base,
        port: ${envOptions.SB_PORT || cliOptions.port || 'undefined'} || base.port,
        host: ${cliOptions.host || 'undefined'} || base.host,
        static: (base.static || []).concat(${JSON.stringify(cliOptions.staticDir)}),
      });
    `;
  }

  if (cliOptions.outputDir) {
    code += `
      export const output = {
        location: ${JSON.stringify(cliOptions.outputDir)},
      };
    `;
  }

  return {
    code,
  };
};
