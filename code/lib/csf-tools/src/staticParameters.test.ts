import * as traverse from '@babel/traverse';
import { dedent } from 'ts-dedent';

import { parseStaticParameters, type StaticParametersOptions } from './staticParameters';
import { babelParse } from './babelParse';

const parse = (code: string, options: StaticParametersOptions) => {
  const ast = babelParse(code);
  let defaultExport: traverse.NodePath;

  traverse.default(ast, {
    ExportDefaultDeclaration: {
      enter(path) {
        defaultExport = path.get('declaration');
      },
    },
  });

  return parseStaticParameters(defaultExport!, 'basePath', options);
};

const NO_RESOLVER = () => {
  throw new Error('not implemented');
};

it('inline', () => {
  expect(
    parse(
      dedent`
        export default {
          foo: (2-1),
          bar: 'bar',
          baz: (() => 'baz')(),
          error
        }
      `,
      {
        parameterList: ['foo', 'bar', 'baz', 'error'],
        resolver: NO_RESOLVER,
      }
    )
  ).toMatchInlineSnapshot(`
    Object {
      "bar": "bar",
      "baz": "baz",
      "error": [ReferenceError: error is not defined],
      "foo": 1,
    }
  `);
});

it('variable references', () => {
  expect(
    parse(
      dedent`
        const foo = 1;
        const bar = 'bar';
        const baz = () => 'baz';
        export default {
          foo,
          bar,
          baz,
          error
        }
      `,
      {
        parameterList: ['foo', 'bar', 'baz', 'error'],
        resolver: NO_RESOLVER,
      }
    )
  ).toMatchInlineSnapshot(`
    Object {
      "bar": "bar",
      "baz": [Function],
      "error": [ReferenceError: error is not defined],
      "foo": 1,
    }
  `);
});

it('object spread', () => {
  expect(
    parse(
      dedent`
        const foo = {
          baz: 'baz',
        };
        export default {
          ...foo,
          bar: 'bar',
        }
      `,
      {
        parameterList: ['bar', 'baz'],
        resolver: NO_RESOLVER,
      }
    )
  ).toMatchInlineSnapshot(`
    Object {
      "bar": "bar",
      "baz": "baz",
    }
  `);
});

it('relative path import', () => {
  expect(
    parse(
      dedent`
        import { allModes } from '../.storybook/modes';
        export default {
          chromatic: { modes: allModes },
        }
      `,
      {
        parameterList: ['chromatic'],
        resolver: () => 'resolved',
      }
    )
  ).toMatchInlineSnapshot(`
    Object {
      "chromatic": Object {
        "modes": "resolved",
      },
    }
  `);
});

it('nested variable references', () => {
  expect(
    parse(
      dedent`
        const allModes = { foo: 'bar' };
        export default {
          chromatic: { modes: allModes },
        }
      `,
      {
        parameterList: ['chromatic'],
        resolver: () => 'resolved',
      }
    )
  ).toMatchInlineSnapshot(`
    Object {
      "chromatic": Object {
        "modes": Object {
          "foo": "bar",
        },
      },
    }
  `);
});

it('absolute path import', () => {
  expect(
    parse(
      dedent`
        import { allModes } from '/Users/shilman/.storybook/modes';
        export default {
          chromatic: { modes: allModes },
        }
      `,
      {
        parameterList: ['chromatic'],
        resolver: () => 'resolved',
      }
    )
  ).toMatchInlineSnapshot(`
    Object {
      "chromatic": Object {
        "modes": "resolved",
      },
    }
  `);
});

it('alias import', () => {
  expect(
    parse(
      dedent`
        import { allModes } from '@/.storybook/modes';
        export default {
          chromatic: { modes: allModes },
        }
      `,
      {
        parameterList: ['chromatic'],
        resolver: () => {
          throw new Error('Could not resolve');
        },
      }
    )
  ).toMatchInlineSnapshot(`
    Object {
      "chromatic": [Error: Could not resolve],
    }
  `);
});

it('package import', () => {
  expect(
    parse(
      dedent`
        import { allModes } from '@storybook/modes';
        export default {
          chromatic: { modes: allModes },
        }
      `,
      {
        parameterList: ['chromatic'],
        resolver: () => {
          throw new Error('Could not resolve');
        },
      }
    )
  ).toMatchInlineSnapshot(`
    Object {
      "chromatic": [Error: Could not resolve],
    }
  `);
});
