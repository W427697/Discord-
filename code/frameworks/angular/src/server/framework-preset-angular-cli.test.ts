import path from 'path';
import { Configuration } from 'webpack';
import { logger } from '@storybook/node-logger';
import { logging, JsonObject } from '@angular-devkit/core';
import { BuilderContext } from '@angular-devkit/architect';
import { Schema } from '@angular-devkit/build-angular/src/builders/browser/schema';
import { migrationToBuilderReferrenceMessage, webpackFinal } from './framework-preset-angular-cli';
import { PresetOptions } from './preset-options';

const testPath = __dirname;

let workspaceRoot = testPath;
let cwdSpy: jest.SpyInstance;

// jest.mock('@angular-devkit/build-angular/src/utils/load-esm', () => ({
//   loadEsmModule: (modulePath: string) => {
//     return import(modulePath);
//   },
// }));

beforeEach(() => {
  cwdSpy = jest.spyOn(process, 'cwd');
  jest.spyOn(logger, 'error').mockImplementation();
  jest.spyOn(logger, 'info').mockImplementation();
});

afterEach(() => {
  jest.clearAllMocks();
});

function initMockWorkspace(name: string) {
  workspaceRoot = path.join(__dirname, '__mocks-ng-workspace__', name);
  cwdSpy.mockReturnValue(workspaceRoot);
}

// TODO: Skipping this for now due to some long running/never-ending process. Debugging necessary.
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('framework-preset-angular-cli', () => {
  let options: PresetOptions;

  beforeEach(() => {
    options = {} as PresetOptions;
  });

  describe('without angular.json', () => {
    beforeEach(() => {
      initMockWorkspace('');
    });
    it('should throw and display migration to builder log error', async () => {
      await expect(() => webpackFinal(newWebpackConfiguration(), options)).rejects.toThrowError(
        'angularBrowserTarget is undefined.'
      );

      expect(logger.error).toHaveBeenCalledWith(migrationToBuilderReferrenceMessage);
    });
  });

  describe('with angularBrowserTarget option', () => {
    beforeEach(() => {
      initMockWorkspace('minimal-config');
      options = {
        angularBrowserTarget: 'target-project:target-build',
        angularBuilderContext: mockBuilderContext({}),
        tsConfig: './tsconfig.json',
      } as PresetOptions;
    });
    it('should log', async () => {
      const baseWebpackConfig = newWebpackConfiguration();
      // const ngCli = await import('@angular/compiler-cli');
      // const ngCli2 = await loadEsmModule('@angular/compiler-cli');
      // const ngCli = await import('./framework-preset-angular-cli');
      // const ngCli2 = await import('@angular/compiler-cli');
      // const ngCli2 = ngCli3;
      // const ngCli2 = formatDiagnostics;
      // console.log(ngCli2 !== null);
      // const imp2 = require('./preset-options');
      await webpackFinal(baseWebpackConfig, options);

      expect(logger.info).toHaveBeenCalledTimes(3);
      expect(logger.info).toHaveBeenNthCalledWith(
        1,
        '=> Loading angular-cli config for angular >= 13.0.0'
      );
      expect(logger.info).toHaveBeenNthCalledWith(
        2,
        '=> Using angular browser target options from "target-project:target-build"'
      );
      expect(logger.info).toHaveBeenNthCalledWith(
        3,
        '=> Using angular project with "tsConfig:./tsconfig.json"'
      );
    });

    it('should extends webpack base config', async () => {
      const baseWebpackConfig = newWebpackConfiguration();
      const webpackFinalConfig = await webpackFinal(baseWebpackConfig, options);

      expect(webpackFinalConfig).toEqual({
        ...baseWebpackConfig,
        entry: [
          ...(baseWebpackConfig.entry as any[]),
          // path.join(workspaceRoot, 'src', 'styles.css'),
          expect.stringContaining(
            '/node_modules/@angular-devkit/build-angular/node_modules/core-js/proposals/reflect-metadata.js'
          ),
        ],
        module: { ...baseWebpackConfig.module, rules: expect.anything() },
        plugins: expect.anything(),
        resolve: {
          ...baseWebpackConfig.resolve,
          modules: expect.arrayContaining(baseWebpackConfig?.resolve?.modules ?? []),
          // the base resolve.plugins are not kept 🤷‍♂️
          plugins: expect.not.arrayContaining(baseWebpackConfig?.resolve?.plugins ?? []),
        },
        resolveLoader: expect.anything(),
      });
    });
  });

  describe('with styles option', () => {
    beforeEach(() => {
      initMockWorkspace('with-styles');
      options = {
        angularBrowserTarget: 'target-project:target-build',
        angularBuilderContext: mockBuilderContext({}),
        angularBuilderOptions: {
          styles: ['src/styles.css'],
        },
        tsConfig: './tsconfig.json',
      } as PresetOptions;
    });

    it('should include styles in webpack config', async () => {
      const baseWebpackConfig = newWebpackConfiguration();
      const webpackFinalConfig = await webpackFinal(baseWebpackConfig, options);

      expect(webpackFinalConfig).toEqual({
        ...baseWebpackConfig,
        entry: [
          ...(baseWebpackConfig.entry as any[]),
          path.join(workspaceRoot, 'src', 'styles.css'),
          expect.stringContaining(
            '/node_modules/@angular-devkit/build-angular/node_modules/core-js/proposals/reflect-metadata.js'
          ),
        ],
        module: { ...baseWebpackConfig.module, rules: expect.anything() },
        plugins: expect.anything(),
        resolve: {
          ...baseWebpackConfig.resolve,
          modules: expect.arrayContaining(baseWebpackConfig?.resolve?.modules ?? []),
          // the base resolve.plugins are not kept 🤷‍♂️
          plugins: expect.not.arrayContaining(baseWebpackConfig?.resolve?.plugins ?? []),
        },
        resolveLoader: expect.anything(),
      });
    });
  });
});

const newWebpackConfiguration = (
  transformer: (c: Configuration) => Configuration = (c) => c
): Configuration => {
  return transformer({
    name: 'preview',
    mode: 'development',
    bail: false,
    devtool: 'cheap-module-source-map',
    entry: [
      '/Users/joe/storybook/lib/core-server/dist/esm/globals/polyfills.js',
      '/Users/joe/storybook/examples/angular-cli/.storybook/storybook-init-framework-entry.js',
      '/Users/joe/storybook/addons/docs/dist/esm/frameworks/common/config.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/docs/dist/esm/frameworks/angular/config.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/actions/dist/esm/preset/addDecorator.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/actions/dist/esm/preset/addArgs.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/links/dist/esm/preset/addDecorator.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/knobs/dist/esm/preset/addDecorator.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/backgrounds/dist/esm/preset/addDecorator.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/backgrounds/dist/esm/preset/addParameter.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/a11y/dist/esm/a11yRunner.js-generated-other-entry.js',
      '/Users/joe/storybook/addons/a11y/dist/esm/a11yHighlight.js-generated-other-entry.js',
      '/Users/joe/storybook/examples/angular-cli/.storybook/preview.ts-generated-config-entry.js',
      '/Users/joe/storybook/examples/angular-cli/.storybook/generated-stories-entry.js',
      '/Users/joe/storybook/node_modules/webpack-hot-middleware/client.js?reload=true&quiet=false&noInfo=undefined',
    ],
    output: {
      path: '/Users/joe/storybook/examples/angular-cli/node_modules/.cache/storybook/public',
      filename: '[name].[hash].bundle.js',
      publicPath: '',
    },
    plugins: [{ keepBasePlugin: true } as any],
    module: {
      rules: [{ keepBaseRule: true } as any],
    },
    resolve: {
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.cjs'],
      modules: ['node_modules'],
      mainFields: ['browser', 'main'],
      alias: {
        '@storybook/preview-api': '/Users/joe/storybook/lib/addons',
        '@storybook/manager-api': '/Users/joe/storybook/lib/api',
        '@storybook/channels': '/Users/joe/storybook/lib/channels',
        '@storybook/channel-postmessage': '/Users/joe/storybook/lib/channel-postmessage',
        '@storybook/components': '/Users/joe/storybook/ui/components',
        '@storybook/core-events': '/Users/joe/storybook/lib/core-events',
        '@storybook/router': '/Users/joe/storybook/lib/router',
        '@storybook/theming': '/Users/joe/storybook/lib/theming',
        '@storybook/client-api': '/Users/joe/storybook/lib/client-api',
        '@storybook/client-logger': '/Users/joe/storybook/lib/client-logger',
        react: '/Users/joe/storybook/node_modules/react',
        'react-dom': '/Users/joe/storybook/node_modules/react-dom',
      },
      plugins: [{ keepBasePlugin: true } as any],
    },
    resolveLoader: { plugins: [] },
    optimization: {
      splitChunks: { chunks: 'all' },
      runtimeChunk: true,
      sideEffects: true,
      usedExports: true,
      concatenateModules: true,
      minimizer: [],
    },
    performance: { hints: false },
  });
};

/**
 * Get Builder Context
 * If storybook is not start by angular builder create dumb BuilderContext
 */
const mockBuilderContext = (targetOptions: Partial<Schema>): BuilderContext => {
  const context: Partial<BuilderContext> = {
    target: { project: 'noop-project', builder: '', options: {}, target: '' },
    workspaceRoot: process.cwd(),
    getProjectMetadata: () => Promise.resolve({}),
    getTargetOptions: () => Promise.resolve(targetOptions as JsonObject),
    logger: new logging.Logger('Storybook'),
  };
  return context as BuilderContext;
};
