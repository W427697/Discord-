/* eslint-disable no-underscore-dangle */
import { describe, it, expect, vi } from 'vitest';
import * as fsExtraImp from 'fs-extra';
import path from 'path';

// eslint-disable-next-line jest/no-mocks-import
import type * as MockedFSToExtra from '../../../__mocks__/fs-extra';

import { getMonorepoType, monorepoConfigs } from './get-monorepo-type';

vi.mock('fs-extra', async () => import('../../../__mocks__/fs-extra'));
const fsExtra = fsExtraImp as unknown as typeof MockedFSToExtra;

vi.mock('@storybook/core-common', async () => {
  const coreCommon: any = await vi.importActual('@storybook/core-common');
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

  fsExtra.__setMockFiles(mockFiles);

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
