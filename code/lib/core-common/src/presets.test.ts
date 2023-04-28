import path from 'path';
import { logger } from '@junk-temporary-prototypes/node-logger';
import './presets';

function wrapPreset(basePresets: any): { babel: Function; webpack: Function } {
  return {
    babel: async (config: any, args: any) => basePresets.apply('babel', config, args),
    webpack: async (config: any, args: any) => basePresets.apply('webpack', config, args),
  };
}

function mockPreset(name: string, mockPresetObject: any) {
  jest.mock(name, () => mockPresetObject, { virtual: true });
}

jest.mock('@junk-temporary-prototypes/node-logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('./utils/safeResolve', () => {
  const KNOWN_FILES = [
    '@junk-temporary-prototypes/react',
    '@junk-temporary-prototypes/addon-actions/manager',
    '@junk-temporary-prototypes/addon-actions/register',
    './local/preset',
    './local/addons',
    '/absolute/preset',
    '/absolute/addons',
    '@junk-temporary-prototypes/addon-docs',
    '@junk-temporary-prototypes/addon-cool',
    '@junk-temporary-prototypes/addon-docs/preset',
    '@junk-temporary-prototypes/addon-interactions/preset',
    '@junk-temporary-prototypes/addon-essentials',
    '@junk-temporary-prototypes/addon-knobs/manager',
    '@junk-temporary-prototypes/addon-knobs/register',
    '@junk-temporary-prototypes/addon-notes/register-panel',
    '@junk-temporary-prototypes/preset-create-react-app',
    '@junk-temporary-prototypes/preset-typescript',
    'addon-bar/preset.js',
    'addon-bar',
    'addon-baz/register.js',
    'addon-foo/register.js',
  ];

  return {
    safeResolveFrom: jest.fn((l: any, name: string) => {
      if (KNOWN_FILES.includes(name)) {
        return name;
      }
      return undefined;
    }),
    safeResolve: jest.fn((name: string) => {
      if (KNOWN_FILES.includes(name)) {
        return name;
      }
      return undefined;
    }),
  };
});

describe('presets', () => {
  it('does not throw when there is no preset file', async () => {
    const { getPresets } = jest.requireActual('./presets');
    let presets;

    async function testPresets() {
      presets = wrapPreset(await getPresets());
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(presets).toBeDefined();
  });

  it('does not throw when presets are empty', async () => {
    const { getPresets } = jest.requireActual('./presets');
    const presets = wrapPreset(await getPresets([]));

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();
  });

  it('does not throw when preset can not be loaded', async () => {
    const { getPresets } = jest.requireActual('./presets');
    const presets = wrapPreset(await getPresets(['preset-foo']));

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();
  });

  it('loads and applies presets when they are combined in another preset', async () => {
    mockPreset('preset-foo', {
      foo: (exec: string[]) => exec.concat('foo'),
    });

    mockPreset('preset-bar', {
      foo: (exec: string[]) => exec.concat('bar'),
    });

    mockPreset('preset-got', [
      'preset-dracarys',
      { name: 'preset-valar', options: { custom: 'morghulis' } },
    ]);

    mockPreset('preset-dracarys', {
      foo: (exec: string[]) => exec.concat('dracarys'),
    });

    mockPreset('preset-valar', {
      foo: (exec: string[], options: any) => exec.concat(`valar ${options.custom}`),
    });

    const { getPresets } = jest.requireActual('./presets');
    const presets = await getPresets(['preset-foo', 'preset-got', 'preset-bar'], {});

    const result = await presets.apply('foo', []);

    expect(result).toEqual(['foo', 'dracarys', 'valar morghulis', 'bar']);
  });

  it('loads and applies presets when they are declared as a string', async () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const { getPresets } = jest.requireActual('./presets');
    const presets = wrapPreset(await getPresets(['preset-foo', 'preset-bar'], {}));

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalled();
    expect(mockPresetBarExtendBabel).toHaveBeenCalled();
  });

  it('loads  and applies presets when they are declared as an object without props', async () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const { getPresets } = jest.requireActual('./presets');
    const presets = wrapPreset(
      await getPresets([{ name: 'preset-foo' }, { name: 'preset-bar' }], {})
    );

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalled();
    expect(mockPresetBarExtendBabel).toHaveBeenCalled();
  });

  it('loads and applies presets when they are declared as an object with props', async () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const { getPresets } = jest.requireActual('./presets');
    const presets = wrapPreset(
      await getPresets(
        [
          { name: 'preset-foo', options: { foo: 1 } },
          { name: 'preset-bar', options: { bar: 'a' } },
        ],
        {}
      )
    );

    async function testPresets() {
      await presets.webpack({});
      await presets.babel({});
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalledWith(expect.anything(), {
      foo: 1,
      presetsList: expect.anything(),
      presets: expect.anything(),
    });
    expect(mockPresetBarExtendBabel).toHaveBeenCalledWith(expect.anything(), {
      bar: 'a',
      presetsList: expect.anything(),
      presets: expect.anything(),
    });
  });

  it('loads and applies presets when they are declared as a string and as an object', async () => {
    const mockPresetFooExtendWebpack = jest.fn();
    const mockPresetBarExtendBabel = jest.fn();

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      babel: mockPresetBarExtendBabel,
    });

    const { getPresets } = jest.requireActual('./presets');
    const presets = wrapPreset(
      await getPresets(
        [
          'preset-foo',
          {
            name: 'preset-bar',
            options: {
              bar: 'a',
            },
          },
        ],
        {}
      )
    );

    async function testPresets() {
      await presets.webpack({});
      await presets.babel({});
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalled();
    expect(mockPresetBarExtendBabel).toHaveBeenCalledWith(expect.anything(), {
      bar: 'a',
      presetsList: expect.arrayContaining([
        expect.objectContaining({ name: 'preset-foo' }),
        expect.objectContaining({ name: 'preset-bar' }),
      ]),
      presets: expect.anything(),
    });
  });

  it('applies presets in chain', async () => {
    const mockPresetFooExtendWebpack = jest.fn((...args: any[]) => ({}));
    const mockPresetBarExtendWebpack = jest.fn((...args: any[]) => ({}));

    mockPreset('preset-foo', {
      webpack: mockPresetFooExtendWebpack,
    });

    mockPreset('preset-bar', {
      webpack: mockPresetBarExtendWebpack,
    });

    const { getPresets } = jest.requireActual('./presets');
    const presets = wrapPreset(
      await getPresets(
        [
          'preset-foo',
          {
            name: 'preset-bar',
            options: {
              bar: 'a',
              presetsList: expect.arrayContaining([
                expect.objectContaining({ name: 'preset-foo' }),
                expect.objectContaining({ name: 'preset-bar' }),
              ]),
              presets: expect.anything(),
            },
          },
        ],
        {}
      )
    );

    async function testPresets() {
      await presets.webpack();
      await presets.babel();
    }

    await expect(testPresets()).resolves.toBeUndefined();

    expect(mockPresetFooExtendWebpack).toHaveBeenCalled();
    expect(mockPresetBarExtendWebpack).toHaveBeenCalledWith(expect.anything(), {
      bar: 'a',
      presetsList: expect.arrayContaining([
        expect.objectContaining({ name: 'preset-foo' }),
        expect.objectContaining({ name: 'preset-bar' }),
      ]),
      presets: expect.anything(),
    });
  });

  it('allows for presets to export presets array', async () => {
    const { getPresets } = jest.requireActual('./presets');
    const input = {};
    const mockPresetBar = jest.fn((...args: any[]) => input);

    mockPreset('preset-foo', {
      presets: ['preset-bar'],
    });

    mockPreset('preset-bar', {
      bar: mockPresetBar,
    });

    const presets = await getPresets(['preset-foo'], {});

    const output = await presets.apply('bar');

    expect(mockPresetBar).toHaveBeenCalledWith(undefined, expect.any(Object));

    expect(input).toBe(output);
  });

  it('allows for presets to export presets fn', async () => {
    const { getPresets } = jest.requireActual('./presets');
    const input = {};
    const storybookOptions = { a: 1 };
    const presetOptions = { b: 2 };
    const mockPresetBar = jest.fn((...args: any[]) => input);
    const mockPresetFoo = jest.fn((...args: any[]) => ['preset-bar']);

    mockPreset('preset-foo', {
      presets: mockPresetFoo,
    });

    mockPreset('preset-bar', {
      bar: mockPresetBar,
    });

    const presets = await getPresets([{ name: 'preset-foo', options: { b: 2 } }], storybookOptions);

    const output = await presets.apply('bar');

    expect(mockPresetFoo).toHaveBeenCalledWith({ ...storybookOptions, ...presetOptions });
    expect(mockPresetBar).toHaveBeenCalledWith(undefined, expect.any(Object));

    expect(input).toBe(output);
  });

  afterEach(() => {
    jest.resetModules();
  });
});

describe('resolveAddonName', () => {
  const { resolveAddonName } = jest.requireActual('./presets');

  it('should resolve packages with metadata (relative path)', () => {
    mockPreset('./local/preset', {
      presets: [],
    });
    expect(resolveAddonName({}, './local/preset')).toEqual({
      name: './local/preset',
      type: 'presets',
    });
  });

  it('should resolve packages with metadata (absolute path)', () => {
    mockPreset('/absolute/preset', {
      presets: [],
    });
    expect(resolveAddonName({}, '/absolute/preset')).toEqual({
      name: '/absolute/preset',
      type: 'presets',
    });
  });

  it('should resolve packages without metadata', () => {
    expect(resolveAddonName({}, '@junk-temporary-prototypes/preset-create-react-app')).toEqual({
      name: '@junk-temporary-prototypes/preset-create-react-app',
      type: 'presets',
    });
  });

  it('should resolve managerEntries', () => {
    expect(resolveAddonName({}, '@junk-temporary-prototypes/addon-actions/register')).toEqual({
      name: '@junk-temporary-prototypes/addon-actions/register',
      managerEntries: [path.normalize('@junk-temporary-prototypes/addon-actions/register')],
      type: 'virtual',
    });
  });

  it('should resolve managerEntries from new /manager path', () => {
    expect(resolveAddonName({}, '@junk-temporary-prototypes/addon-actions/manager')).toEqual({
      name: '@junk-temporary-prototypes/addon-actions/manager',
      managerEntries: [path.normalize('@junk-temporary-prototypes/addon-actions/manager')],
      type: 'virtual',
    });
  });

  it('should resolve presets', () => {
    expect(resolveAddonName({}, '@junk-temporary-prototypes/addon-docs/preset')).toEqual({
      name: '@junk-temporary-prototypes/addon-docs/preset',
      type: 'presets',
    });
  });

  it('should resolve preset packages', () => {
    expect(resolveAddonName({}, '@junk-temporary-prototypes/addon-essentials')).toEqual({
      name: '@junk-temporary-prototypes/addon-essentials',
      type: 'presets',
    });
  });

  it('should error on invalid inputs', () => {
    expect(() => resolveAddonName({}, null)).toThrow();
  });
});

describe('loadPreset', () => {
  mockPreset('@junk-temporary-prototypes/react', {});
  mockPreset('@junk-temporary-prototypes/preset-typescript', {});
  mockPreset('@junk-temporary-prototypes/addon-docs/preset', {});
  mockPreset('@junk-temporary-prototypes/addon-actions/register', {});
  mockPreset('addon-foo/register.js', {});
  mockPreset('@junk-temporary-prototypes/addon-cool', {});
  mockPreset('@junk-temporary-prototypes/addon-interactions/preset', {});
  mockPreset('addon-bar', {
    addons: ['@junk-temporary-prototypes/addon-cool'],
    presets: ['@junk-temporary-prototypes/addon-interactions/preset'],
  });
  mockPreset('addon-baz/register.js', {});
  mockPreset('@junk-temporary-prototypes/addon-notes/register-panel', {});

  const { loadPreset } = jest.requireActual('./presets');

  beforeEach(() => {
    jest.spyOn(logger, 'warn');
  });

  it('should prepend framework field to list of presets', async () => {
    const loaded = await loadPreset(
      {
        name: '',
        type: 'virtual',
        framework: '@junk-temporary-prototypes/react',
        presets: ['@junk-temporary-prototypes/preset-typescript'],
        addons: ['@junk-temporary-prototypes/addon-docs/preset'],
      },
      0,
      {}
    );
    expect(loaded).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "@junk-temporary-prototypes/preset-typescript",
          "options": Object {},
          "preset": Object {},
        },
        Object {
          "name": "@junk-temporary-prototypes/addon-docs/preset",
          "options": Object {},
          "preset": Object {},
        },
        Object {
          "name": Object {
            "addons": Array [
              "@junk-temporary-prototypes/addon-docs/preset",
            ],
            "framework": "@junk-temporary-prototypes/react",
            "name": "",
            "presets": Array [
              "@junk-temporary-prototypes/preset-typescript",
            ],
            "type": "virtual",
          },
          "options": Object {},
          "preset": Object {
            "framework": "@junk-temporary-prototypes/react",
          },
        },
      ]
    `);
  });

  it('should resolve all addons & presets in correct order', async () => {
    const loaded = await loadPreset(
      {
        name: '',
        type: 'virtual',
        presets: ['@junk-temporary-prototypes/preset-typescript'],
        addons: [
          '@junk-temporary-prototypes/addon-docs/preset',
          '@junk-temporary-prototypes/addon-actions/register',
          'addon-foo/register.js',
          'addon-bar',
          'addon-baz/register.js',
          '@junk-temporary-prototypes/addon-notes/register-panel',
        ],
      },
      0,
      {}
    );
    expect(loaded).toEqual([
      {
        name: '@junk-temporary-prototypes/preset-typescript',
        options: {},
        preset: {},
      },
      {
        name: '@junk-temporary-prototypes/addon-docs/preset',
        options: {},
        preset: {},
      },
      {
        name: '@junk-temporary-prototypes/addon-actions/register',
        options: {},
        preset: {
          managerEntries: [path.normalize('@junk-temporary-prototypes/addon-actions/register')],
        },
      },
      {
        name: 'addon-foo/register.js',
        options: {},
        preset: {
          managerEntries: [path.normalize('addon-foo/register')],
        },
      },
      {
        name: '@junk-temporary-prototypes/addon-interactions/preset',
        options: {},
        preset: {},
      },
      {
        name: '@junk-temporary-prototypes/addon-cool',
        options: {},
        preset: {},
      },
      {
        name: 'addon-bar',
        options: {},
        preset: {},
      },
      {
        name: 'addon-baz/register.js',
        options: {},
        preset: {
          managerEntries: [path.normalize('addon-baz/register')],
        },
      },
      {
        name: '@junk-temporary-prototypes/addon-notes/register-panel',
        options: {},
        preset: {
          managerEntries: [path.normalize('@junk-temporary-prototypes/addon-notes/register-panel')],
        },
      },
      {
        name: {
          presets: ['@junk-temporary-prototypes/preset-typescript'],
          addons: [
            '@junk-temporary-prototypes/addon-docs/preset',
            '@junk-temporary-prototypes/addon-actions/register',
            'addon-foo/register.js',
            'addon-bar',
            'addon-baz/register.js',
            '@junk-temporary-prototypes/addon-notes/register-panel',
          ],
          name: '',
          type: 'virtual',
        },
        options: {},
        preset: {},
      },
    ]);
  });

  it('should warn for addons that are not installed', async () => {
    const loaded = await loadPreset(
      {
        name: '',
        type: 'virtual',
        framework: '@junk-temporary-prototypes/react',
        presets: ['@junk-temporary-prototypes/preset-typescript'],
        addons: ['@junk-temporary-prototypes/addon-docs/preset', 'uninstalled-addon'],
      },
      0,
      {}
    );
    expect(logger.warn).toHaveBeenCalledWith(
      'Could not resolve addon "uninstalled-addon", skipping. Is it installed?'
    );
    expect(loaded).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "@junk-temporary-prototypes/preset-typescript",
          "options": Object {},
          "preset": Object {},
        },
        Object {
          "name": "@junk-temporary-prototypes/addon-docs/preset",
          "options": Object {},
          "preset": Object {},
        },
        Object {
          "name": Object {
            "addons": Array [
              "@junk-temporary-prototypes/addon-docs/preset",
              "uninstalled-addon",
            ],
            "framework": "@junk-temporary-prototypes/react",
            "name": "",
            "presets": Array [
              "@junk-temporary-prototypes/preset-typescript",
            ],
            "type": "virtual",
          },
          "options": Object {},
          "preset": Object {
            "framework": "@junk-temporary-prototypes/react",
          },
        },
      ]
    `);
  });
});
