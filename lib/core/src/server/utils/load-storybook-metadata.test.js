import { loadStorybookMetadata, loadPackageMetadata } from './load-storybook-metadata';

const PACKAGEJSON_FIXTURES = {
  presetAddon: { version: '1.0.0', storybook: { preset: 'presetPath' } },
  registerAddon: { version: '1.0.0', storybook: { register: 'registerPath' } },
  unknownAddon: { version: '1.0.0', storybook: {} },
  unknownPackage: { version: '1.0.0' },
  semverRangePackage: { version: '1.0.0' },
  prereleasePackage: { version: '1.0.0-alpha.0' },
  tagRangePackage: { version: '1.0.0' },
  anyRangePackage: { version: '1.0.0' },
};

const getPackageJson = async packageName => PACKAGEJSON_FIXTURES[packageName];
const cache = {
  presetAddon: { versionRange: 'v0', version: '0.0.1', storybook: 'cachedStorybookValue' },
  semverRangePackage: {
    versionRange: '1.0.x',
    version: '1.0.0',
    storybook: 'cachedStorybookValue',
  },
  prereleaseRangePackage: {
    versionRange: '^1.0.0-alpha.0',
    version: '1.0.0-alpha.1',
    storybook: 'cachedStorybookValue',
  },
  tagRangePackage: { versionRange: 'next', version: '1.0.0', storybook: 'cachedStorybookValue' },
  anyRangePackage: { versionRange: '*', version: '1.0.0', storybook: 'cachedStorybookValue' },
};
const options = { getPackageJson, cache };

describe('loadPackageMetadata', () => {
  it('handles cached values', async () => {
    expect(await loadPackageMetadata('presetAddon', 'v0', options)).toEqual({
      versionRange: 'v0',
      version: '0.0.1',
      storybook: 'cachedStorybookValue',
    });
  });
  it('handles addon upgrades', async () => {
    expect(await loadPackageMetadata('presetAddon', 'v1', options)).toEqual({
      versionRange: 'v1',
      version: '1.0.0',
      storybook: { preset: 'presetPath' },
    });
  });
  it('handles uncached values', async () => {
    expect(await loadPackageMetadata('registerAddon', 'v1', options)).toEqual({
      versionRange: 'v1',
      version: '1.0.0',
      storybook: { register: 'registerPath' },
    });
  });
  it('caches semver ranges', async () => {
    expect(await loadPackageMetadata('semverRangePackage', '1.0.x', options)).toEqual({
      versionRange: '1.0.x',
      version: '1.0.0',
      storybook: 'cachedStorybookValue',
    });
  });
  it('caches prereleases', async () => {
    expect(await loadPackageMetadata('prereleaseRangePackage', '^1.0.0-alpha.0', options)).toEqual({
      versionRange: '^1.0.0-alpha.0',
      version: '1.0.0-alpha.1',
      storybook: 'cachedStorybookValue',
    });
  });
  it('doesnt cache dist tags', async () => {
    expect(await loadPackageMetadata('tagRangePackage', 'next', options)).toEqual({
      versionRange: 'next',
      version: '1.0.0',
      storybook: undefined,
    });
  });
  it('doesnt cache any range', async () => {
    expect(await loadPackageMetadata('anyRangePackage', '*', options)).toEqual({
      versionRange: '*',
      version: '1.0.0',
      storybook: undefined,
    });
  });
});

describe('loadStorybookMetadata', () => {
  it('uncached', async () => {
    const packageJson = {
      dependencies: {
        unknownAddon: '1.0.0',
        unknownPackage: '1.0.0',
      },
      devDependencies: {
        presetAddon: '1.0.0',
        registerAddon: '1.0.0',
      },
    };
    expect(await loadStorybookMetadata(packageJson, options)).toEqual({
      unknownAddon: { versionRange: '1.0.0', version: '1.0.0', storybook: {} },
      unknownPackage: { versionRange: '1.0.0', version: '1.0.0', storybook: undefined },
      presetAddon: { versionRange: '1.0.0', version: '1.0.0', storybook: { preset: 'presetPath' } },
      registerAddon: {
        versionRange: '1.0.0',
        version: '1.0.0',
        storybook: { register: 'registerPath' },
      },
    });
  });
  it('cached', async () => {
    const packageJson = {
      dependencies: {
        unknownAddon: '1.0.0',
        unknownPackage: '1.0.0',
        presetAddon: 'v0',
      },
      devDependencies: {
        registerAddon: '1.0.0',
      },
    };
    expect(await loadStorybookMetadata(packageJson, options)).toEqual({
      unknownAddon: { versionRange: '1.0.0', version: '1.0.0', storybook: {} },
      unknownPackage: { versionRange: '1.0.0', version: '1.0.0', storybook: undefined },
      presetAddon: { versionRange: 'v0', version: '0.0.1', storybook: 'cachedStorybookValue' },
      registerAddon: {
        versionRange: '1.0.0',
        version: '1.0.0',
        storybook: { register: 'registerPath' },
      },
    });
  });
});
