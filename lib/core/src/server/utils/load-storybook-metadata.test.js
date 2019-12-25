import { loadStorybookMetadata, loadPackageMetadata } from './load-storybook-metadata';

const PACKAGEJSON_FIXTURES = {
  presetAddon: { version: 'v1', storybook: { preset: 'presetPath' } },
  registerAddon: { version: 'v1', storybook: { register: 'registerPath' } },
  unknownAddon: { version: 'v1', storybook: {} },
  unknownPackage: { version: 'v1' },
};

const getPackageJson = async packageName => PACKAGEJSON_FIXTURES[packageName];
const cache = {
  presetAddon: { version: 'v0', storybook: 'cachedStorybookValue' },
};
const options = { getPackageJson, cache };

describe('loadPackageMetadata', () => {
  it('handles cached values', async () => {
    expect(await loadPackageMetadata('presetAddon', 'v0', options)).toEqual({
      version: 'v0',
      storybook: 'cachedStorybookValue',
    });
  });
  it('handles addon upgrades', async () => {
    expect(await loadPackageMetadata('presetAddon', 'v1', options)).toEqual({
      version: 'v1',
      storybook: { preset: 'presetPath' },
    });
  });
  it('handles uncached values', async () => {
    expect(await loadPackageMetadata('registerAddon', 'v1', options)).toEqual({
      version: 'v1',
      storybook: { register: 'registerPath' },
    });
  });
});

describe('loadStorybookMetadata', () => {
  it('uncached', async () => {
    const packageJson = {
      dependencies: {
        unknownAddon: 'v1',
        unknownPackage: 'v1',
      },
      devDependencies: {
        presetAddon: 'v1',
        registerAddon: 'v1',
      },
    };
    expect(await loadStorybookMetadata(packageJson, options)).toEqual({
      unknownAddon: { version: 'v1', storybook: {} },
      unknownPackage: { version: 'v1', storybook: undefined },
      presetAddon: { version: 'v1', storybook: { preset: 'presetPath' } },
      registerAddon: { version: 'v1', storybook: { register: 'registerPath' } },
    });
  });
  it('cached', async () => {
    const packageJson = {
      dependencies: {
        unknownAddon: 'v1',
        unknownPackage: 'v1',
        presetAddon: 'v0',
      },
      devDependencies: {
        registerAddon: 'v1',
      },
    };
    expect(await loadStorybookMetadata(packageJson, options)).toEqual({
      unknownAddon: { version: 'v1', storybook: {} },
      unknownPackage: { version: 'v1', storybook: undefined },
      presetAddon: { version: 'v0', storybook: 'cachedStorybookValue' },
      registerAddon: { version: 'v1', storybook: { register: 'registerPath' } },
    });
  });
});
