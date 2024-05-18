/* eslint-disable no-underscore-dangle */
import { describe, it, expect, vi } from 'vitest';
import * as fsExtra from 'fs-extra';
import path from 'node:path';

import { getMonorepoType, monorepoConfigs } from './get-monorepo-type';

vi.mock('fs-extra', async () => import('../../../__mocks__/fs-extra'));

vi.mock('@storybook/core/dist/common', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('@storybook/core/dist/common')>()),
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

  vi.mocked<typeof import('../../../__mocks__/fs-extra')>(fsExtra as any).__setMockFiles(mockFiles);

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
