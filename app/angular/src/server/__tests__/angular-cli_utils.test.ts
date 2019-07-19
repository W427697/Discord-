import { Path } from '@angular-devkit/core';

import { getAngularCliParts } from '../angular-cli_utils';
import { getAngularCliWebpackConfigOptions } from '../angular-cli_config';

// @ts-ignore
import angularJson from './angular.json';

// eslint-disable-next-line global-require
jest.mock('fs', () => require('../../../../../__mocks__/fs'));
jest.mock('path', () => ({
  join: (...args) =>
    args[args.length - 1] === 'angular.json'
      ? 'angular.json'
      : jest.requireActual('path').join(...args),
  resolve: (..._args) => 'tsconfig.json',
  parse: jest.requireActual('path').parse,
  dirname: jest.requireActual('path').dirname,
}));

const setupFiles = (files: any) => {
  // eslint-disable-next-line no-underscore-dangle, global-require
  require('fs').__setMockFiles(files);
};

describe('angular-cli_utils', () => {
  describe('getAngularCliParts', () => {
    it('should parse angular cli config correctly', () => {
      setupFiles({ 'angular.json': JSON.stringify(angularJson) });
      let config = getAngularCliWebpackConfigOptions('/' as Path);
      expect(getAngularCliParts(config)).not.toBe(null);

      config = {
        ...config,
        buildOptions: {
          ...config.buildOptions,
        },
      };

      delete config.buildOptions.outputPath;
      delete config.buildOptions.scripts;
      delete config.buildOptions.styles;

      expect(getAngularCliParts(config)).not.toBe(null);
    });
  });
});
