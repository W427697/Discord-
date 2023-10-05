import type { Options, Presets } from '@storybook/types';
import { jest } from '@jest/globals';
import { commonConfig } from './vite-config';

jest.unstable_mockModule('vite', () => ({
  loadConfigFromFile: jest.fn(async () => ({})),
}));

const loadConfigFromFileMock = async () => {
  return jest.mocked((await import('vite')).loadConfigFromFile);
};

const dummyOptions: Options = {
  configType: 'DEVELOPMENT',
  configDir: '',
  packageJson: {},
  presets: {
    apply: async (key: string) =>
      ({
        framework: {
          name: '',
        },
        addons: [],
        core: {
          builder: {},
        },
        options: {},
      }[key]),
  } as Presets,
  presetsList: [],
};

describe('commonConfig', () => {
  it('should preserve default envPrefix', async () => {
    (await loadConfigFromFileMock()).mockReturnValueOnce(
      Promise.resolve({
        config: {},
        path: '',
        dependencies: [],
      })
    );
    const config = await commonConfig(dummyOptions, 'development');
    expect(config.envPrefix).toStrictEqual(['VITE_', 'STORYBOOK_']);
  });

  it('should preserve custom envPrefix string', async () => {
    (await loadConfigFromFileMock()).mockReturnValueOnce(
      Promise.resolve({
        config: { envPrefix: 'SECRET_' },
        path: '',
        dependencies: [],
      })
    );
    const config = await commonConfig(dummyOptions, 'development');
    expect(config.envPrefix).toStrictEqual(['SECRET_', 'STORYBOOK_']);
  });

  it('should preserve custom envPrefix array', async () => {
    (await loadConfigFromFileMock()).mockReturnValueOnce(
      Promise.resolve({
        config: { envPrefix: ['SECRET_', 'VUE_'] },
        path: '',
        dependencies: [],
      })
    );
    const config = await commonConfig(dummyOptions, 'development');
    expect(config.envPrefix).toStrictEqual(['SECRET_', 'VUE_', 'STORYBOOK_']);
  });
});
