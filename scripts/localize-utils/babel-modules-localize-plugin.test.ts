import dedent from 'ts-dedent';
import { transformAsync } from '@babel/core';
import { babelModulesLocalizePlugin } from './babel-modules-localize-plugin';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => true,
});

const localize = (required: string) => {
  // The implementation of the localise function is not important for the test, just that the function is used
  // which we test by asserting the output matches the snapshots
  return `./${required}`;
};

const transform = async (input: string) => {
  const { code } = await transformAsync(input, {
    sourceMaps: false,
    plugins: [
      //
      '@babel/plugin-proposal-export-default-from',
      babelModulesLocalizePlugin(localize),
    ],
  });
  return code;
};

describe('prepare-localize', () => {
  describe('require', () => {
    it('local file', async () => {
      const input = dedent`
        const foo = require('./foo');
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(
        `const foo = require('./foo');`
      );
    });

    it('local file with extension', async () => {
      const input = dedent`
        const foo = require('./foo.png');
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(
        `const foo = require('./foo.png');`
      );
    });

    it('local file with path', async () => {
      const input = dedent`
        const foo = require('./foo/image.png');
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(
        `const foo = require('./foo/image.png');`
      );
    });

    it('package', async () => {
      const input = dedent`
        const foo = require('foo');
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(
        `const foo = require("./foo");`
      );
    });

    it('package concatenation', async () => {
      const input = dedent`
        const variable = 'baz';
        const foo = require('foo' + variable);
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(`
              const variable = 'baz';

              const foo = require("./foo" + variable);
            `);
    });

    it('package concatenation more', async () => {
      const input = dedent`
        const variable = 'baz';
        const foo = require('foo' + variable + 'bar');
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(`
              const variable = 'baz';

              const foo = require("./foo" + variable + 'bar');
            `);
    });

    it('package concatenation with template literals', async () => {
      const input = dedent`
        const variable = 'baz';
        const foo = require(\`foo\${variable}\`);
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(`
              const variable = 'baz';

              const foo = require(\`./foo\${variable}\`);
            `);
    });
  });

  describe('require.resolve', () => {
    it('local file', async () => {
      const input = dedent`
        const foo = require.resolve('./foo');
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(
        `const foo = require.resolve('./foo');`
      );
    });

    it('package', async () => {
      const input = dedent`
        const foo = require.resolve('foo');
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(
        `const foo = require.resolve("./foo");`
      );
    });

    it('package concatenation', async () => {
      const input = dedent`
        const variable = 'baz';
        const foo = require.resolve('foo' + variable);
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(`
              const variable = 'baz';

              const foo = require.resolve("./foo" + variable);
            `);
    });

    it('package concatenation with template literals', async () => {
      const input = dedent`
        const variable = 'baz';
        const foo = require.resolve(\`foo\${variable}\`);
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(`
              const variable = 'baz';

              const foo = require.resolve(\`./foo\${variable}\`);
            `);
    });
  });

  describe('import declaration', () => {
    it('local file', async () => {
      await expect(
        transform(dedent`
          import foo from './foo';
        `)
      ).resolves.toMatchInlineSnapshot(`import foo from './foo';`);
    });

    it('package', async () => {
      await expect(
        transform(dedent`
          import { foo }  from 'foo';
        `)
      ).resolves.toMatchInlineSnapshot(`import { foo } from "./foo";`);
    });

    it('default import', async () => {
      await expect(
        transform(dedent`
          import foo  from 'foo';
        `)
      ).resolves.toMatchInlineSnapshot(`import foo from "./foo";`);
    });

    it('star import', async () => {
      await expect(
        transform(dedent`
          import * as foo  from 'foo';
        `)
      ).resolves.toMatchInlineSnapshot(`import * as foo from "./foo";`);
    });
  });

  describe('async import', () => {
    it('local file', async () => {
      await expect(
        transform(dedent`
        const foo = await import('./foo');
      `)
      ).resolves.toMatchInlineSnapshot(`const foo = await import('./foo');`);
    });

    it('package', async () => {
      await expect(
        transform(dedent`
        const foo = await import('foo');
      `)
      ).resolves.toMatchInlineSnapshot(`const foo = await import("./foo");`);
    });

    it('package concatenation', async () => {
      const input = dedent`
        const variable = 'baz';
        const foo = await import('foo' + variable);
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(`
              const variable = 'baz';
              const foo = await import("./foo" + variable);
            `);
    });

    it('package concatenation with template literals', async () => {
      const input = dedent`
        const variable = 'baz';
        const foo = await import(\`foo\${variable}\`);
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(`
              const variable = 'baz';
              const foo = await import(\`./foo\${variable}\`);
            `);
    });
  });

  describe('export', () => {
    it('local file', async () => {
      await expect(
        transform(dedent`
          export { x } from './foo';
        `)
      ).resolves.toMatchInlineSnapshot(`export { x } from './foo';`);
    });

    it('package', async () => {
      await expect(
        transform(dedent`
          export { x } from 'foo';
        `)
      ).resolves.toMatchInlineSnapshot(`export { x } from "./foo";`);
    });

    it('star export', async () => {
      await expect(
        transform(dedent`
          export * from 'foo';
        `)
      ).resolves.toMatchInlineSnapshot(`export * from "./foo";`);
    });
  });

  describe('edge cases', () => {
    it('trailing slash package', async () => {
      const input = dedent`
        const foo = require('foo/');
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(
        `const foo = require("./foo/");`
      );
    });
    it('trailing slash built-in', async () => {
      const input = dedent`
        const foo = require('string_decoder/');
      `;
      await expect(transform(input)).resolves.toMatchInlineSnapshot(
        `const foo = require('string_decoder/');`
      );
    });
  });
});
