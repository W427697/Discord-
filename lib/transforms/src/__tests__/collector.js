import { exec } from 'node-exec-promise';
import tempWrite from 'temp-write';

import { transform, createExample, createAST, formatCode } from '../__helper__/plugin-test';

import {
  detectSubConfigs,
  removeSubConfigRefs,
  getCorrectPath,
  collectSubConfigs,
  collector,
} from '../modules/collector';

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

  it('multi-files', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/chained-const'),
      require.resolve('../__mocks__/collector/scope/used-both-import'),
    ]);
    const result = formatCode(output.code);

    expect(result).toContain(`const _used = () => _inner()`);
    expect(result).toContain(`import _inner from 'somewhere';`);
    expect(result).toMatchInlineSnapshot(`
      "import _used2, { alsoUsed as _alsoUsed } from 'somewhere';
      import _inner from 'somewhere';

      const _used = () => _inner();

      export const webpack = [
        () => {
          return _used();
        },
        () => {
          return _used2(_alsoUsed());
        },
      ];
      "
    `);
  });

  it('scope imports 1', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/conflicting-import-a'),
      // require.resolve('../__mocks__/collector/scope/conflicting-import-b'),
    ]);
    const result = formatCode(output.code);

    expect(result).toMatchInlineSnapshot(`
      "import _A, {
        B as _B,
        C as _C,
        D as _D,
        E as _E,
        F as _F,
        G as _G,
        H as _H,
      } from '/Users/dev/Projects/GitHub/storybook/core/lib/transforms/src/__mocks__/collector/scope/dummy.js';

      const _X = () => [_A, _B, _C, _D, _E, _F, _G, _H];

      export const webpack = [
        async () => {
          return _X;
        },
      ];
      "
    `);
  });

  it('scope imports 2', async () => {
    const output = await collector([
      require.resolve('../__mocks__/collector/scope/conflicting-import-a'),
      require.resolve('../__mocks__/collector/scope/conflicting-import-b'),
    ]);
    const result = formatCode(output.code);

    expect(result).toMatchInlineSnapshot(`
      "import _A2, {
        B as _B2,
        C as _C2,
        D as _D2,
        E as _E2,
        F as _F2,
        G as _G2,
        H as _H2,
      } from '/Users/dev/Projects/GitHub/storybook/core/lib/transforms/src/__mocks__/collector/scope/dummy.js';

      const _X2 = () => [_A2, _B2, _C2, _D2, _E2, _F2, _G2, _H2];

      import _A, {
        B as _B,
        C as _C,
        D as _D,
        E as _E,
        F as _F,
        G as _G,
        H as _H,
      } from '/Users/dev/Projects/GitHub/storybook/core/lib/transforms/src/__mocks__/collector/scope/dummy.js';

      const _X = () => [_A, _B, _C, _D, _E, _F, _G, _H];

      export const webpack = [
        async () => {
          return _X;
        },
        async () => {
          return _X2;
        },
      ];
      "
    `);

    const p = await tempWrite(result);

    const { stderr, stdout } = await exec(`node -r esm ${p}`);

    expect(stderr).toMatchInlineSnapshot(`""`);
    expect(stdout).toMatchInlineSnapshot(`""`);
  });
});
