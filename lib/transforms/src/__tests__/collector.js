import path from 'path';
import { transform, createExample, createAST, formatCode } from '../__helper__/plugin-test';

import {
  detectSubConfigs,
  removeSubConfigRefs,
  getCorrectPath,
  collectSubConfigs,
  collector,
} from '../modules/collector';

const cacheDir = '/cacheDir';

describe('detectSubConfigs', () => {
  it('should detect addons & presets', async () => {
    const example = await createExample('collector/storybook.config.js');
    const ast = await createAST(example.code);

    const result = detectSubConfigs(ast);

    expect(result).toEqual(expect.arrayContaining(['./presets/a', './addons/a']));
  });
});

describe('removeSubConfigRefs', () => {
  it('remove the correct exports', async () => {
    const example = await createExample('collector/storybook.config.js');
    const { formattedCode } = await transform(example.file, removeSubConfigRefs());

    expect(formattedCode).toMatchInlineSnapshot(`
                        "export const entries = ['*.stories.*'];
                        "
                `);
  });
});

describe('getCorrectPath', () => {
  it('resolves correctly', async () => {
    const example = await createExample('collector/storybook.config.js');
    const from = example.file;
    const ref = './presets/a';

    const result = await getCorrectPath(from, ref);

    expect(result).toContain('collector/presets/a.js');
  });
  it('throws if not found', async () => {
    const example = await createExample('collector/storybook.config.js');
    const from = example.file;
    const ref = './presets/missing';

    await expect(getCorrectPath(from, ref)).rejects.toThrow();
  });
});

describe('collectSubConfigs', () => {
  it('should collect from all refs in order', async () => {
    const example = await createExample('collector/storybook.config.js');

    const result = await collectSubConfigs([example.file]);

    expect(result).toEqual([
      expect.stringContaining('collector/presets/b.js'),
      expect.stringContaining('collector/presets/a.js'),
      expect.stringContaining('collector/addons/a.js'),
      expect.stringContaining('collector/storybook.config.js'),
    ]);
  });
});

describe('collector', () => {
  let result;

  const files = [
    require.resolve('../__mocks__/collector/storybook.config.js'),
    require.resolve('../__mocks__/collector/presets/a.js'),
    require.resolve('../__mocks__/collector/addons/a.js'),
    require.resolve('../__mocks__/collector/presets/b.js'),
  ];

  beforeEach(async () => {
    const output = await collector(files);
    result = formatCode(output.code);
  });

  it('should look as expected', async () => {
    expect(result).toMatchInlineSnapshot(`
      "const _used2 = 'foo';
      import _used from 'somewhere';
      export const webpack = [
        () => {
          // preset b
          console.log(_used);
        },
        () => {
          // preset a
          console.log(_used2);
        },
        () => {
          // addon a
        },
      ];
      export const entries = [['*.stories.*']];
      "
    `);
  });

  it('should have collected the exports in arrays', () => {
    expect(result).toContain('export const entries = [');
    expect(result).toContain('export const webpack = [');
  });

  it('should have added scopes from subConfigs with unique ids', () => {
    expect(result).toContain(`import _used from 'somewhere`);
    expect(result).toContain(`const _used2 = 'foo';`);
  });

  it('should have removed unused vars', () => {
    expect(result).not.toContain(`unused`);
  });
});

describe('collector scope', () => {
  it('used-const', async () => {
    const output = await collector([require.resolve('../__mocks__/collector/scope/used-const')]);
    const result = formatCode(output.code);

    expect(result).toContain(`const _used = () => {}`);
  });

  it('used-default-import', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/used-default-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`import _used from 'somewhere'`);
  });

  it('used-named-import', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/used-named-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`import { used as _used } from 'somewhere'`);
  });

  it('combined-named-import', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/combined-named-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`import { used as _used } from 'somewhere'`);
  });

  it('combined-default-import', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/combined-default-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`import _used from 'somewhere'`);
  });

  it('used-both-import', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/used-both-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`import _used, { alsoUsed as _alsoUsed } from 'somewhere'`);
  });

  it('chained-const', async () => {
    const output = await collector([require.resolve('../__mocks__/collector/scope/chained-const')]);
    const result = formatCode(output.code);

    expect(result).toContain(`const _used = () => _inner()`);
    expect(result).toContain(`import _inner from 'somewhere';`);
  });
});
