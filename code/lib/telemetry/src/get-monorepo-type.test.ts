/* eslint-disable no-underscore-dangle */
import { describe, it, expect, vi } from 'vitest';
import path from 'path';

import { getMonorepoType, monorepoConfigs } from './get-monorepo-type';

// eslint-disable-next-line global-require, jest/no-mocks-import
vi.mock('fs-extra', () => require('../../../__mocks__/fs-extra'));

vi.mock('@storybook/core-common', async () => {
  const coreCommon = await vi.importActual('@storybook/core-common');
  return {
    ...coreCommon,
    getProjectRoot: () => 'root',
  };
});

const checkMonorepoType = ({ monorepoConfigFile, isYarnWorkspace = false }: any) => {
  const mockFiles = {
    [path.join('root', 'package.json')]: isYarnWorkspace ? '{ "workspaces": [] }' : '{}',
  };

  if (monorepoConfigFile) {
    mockFiles[path.join('root', monorepoConfigFile)] = '{}';
  }

  // eslint-disable-next-line global-require
  require('fs-extra').__setMockFiles(mockFiles);

  return getMonorepoType();
};

describe('getMonorepoType', () => {
  describe('Monorepos from json files', () => {
    it.each(Object.entries(monorepoConfigs))(
      'should detect %p from %s file',
      (monorepoName, monorepoConfigFile) => {
        expect(checkMonorepoType({ monorepoConfigFile })).toEqual(monorepoName);
      }
    );
  });

  describe('Yarn|NPM workspaces', () => {
    it('should detect Workspaces from package.json', () => {
      expect(checkMonorepoType({ monorepoConfigFile: undefined, isYarnWorkspace: true })).toEqual(
        'Workspaces'
      );
    });
  });

  describe('Non-monorepos', () => {
    it('should return undefined', () => {
      expect(checkMonorepoType({ monorepoConfigFile: undefined, isYarnWorkspace: false })).toEqual(
        undefined
      );
    });
  });
});
