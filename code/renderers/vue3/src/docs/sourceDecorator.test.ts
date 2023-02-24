import { describe, expect, test } from '@jest/globals';
import type { Args } from '@storybook/types';

import type { ArgsType } from 'jest-mock';
import {
  generateSource,
  getComponentsFromTemplate,
  mapAttributesAndDirectives,
  generateAttributesSource,
} from './sourceDecorator';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val: unknown) => typeof val === 'string',
});
function generateArgTypes(args: Args, slotProps: string[] | undefined) {
  return Object.keys(args).reduce((acc, prop) => {
    acc[prop] = { table: { category: slotProps?.includes(prop) ? 'slots' : 'props' } };
    return acc;
  }, {} as Record<string, any>);
}

function generateForArgs(
  args: Args,
  slotProps: string[] | undefined = undefined,
  template = '<Component />'
) {
  const components = getComponentsFromTemplate(template);
  return generateSource(components, args, generateArgTypes(args, slotProps), true);
}

describe('Vue3: sourceDecorator->mapAttributesAndDirective()', () => {
  test('camelCase boolean Arg', () => {
    expect(mapAttributesAndDirectives({ camelCaseBooleanArg: true })).toMatchInlineSnapshot(`
      Array [
        Object {
          arg: Object {
            content: camel-case-boolean-arg,
            loc: Object {
              source: camel-case-boolean-arg,
            },
          },
          exp: Object {
            isStatic: false,
            loc: Object {
              source: true,
            },
          },
          loc: Object {
            source: :camel-case-boolean-arg='true',
          },
          modifiers: Array [
            ,
          ],
          name: bind,
          type: 6,
        },
      ]
    `);
  });
  test('camelCase string Arg', () => {
    expect(mapAttributesAndDirectives({ camelCaseStringArg: 'foo' })).toMatchInlineSnapshot(`
      Array [
        Object {
          arg: Object {
            content: camel-case-string-arg,
            loc: Object {
              source: camel-case-string-arg,
            },
          },
          exp: Object {
            isStatic: false,
            loc: Object {
              source: foo,
            },
          },
          loc: Object {
            source: camel-case-string-arg='foo',
          },
          modifiers: Array [
            ,
          ],
          name: bind,
          type: 6,
        },
      ]
    `);
  });
  test('boolean arg', () => {
    expect(mapAttributesAndDirectives({ booleanarg: true })).toMatchInlineSnapshot(`
      Array [
        Object {
          arg: Object {
            content: booleanarg,
            loc: Object {
              source: booleanarg,
            },
          },
          exp: Object {
            isStatic: false,
            loc: Object {
              source: true,
            },
          },
          loc: Object {
            source: :booleanarg='true',
          },
          modifiers: Array [
            ,
          ],
          name: bind,
          type: 6,
        },
      ]
    `);
  });
  test('string arg', () => {
    expect(mapAttributesAndDirectives({ stringarg: 'bar' })).toMatchInlineSnapshot(`
      Array [
        Object {
          arg: Object {
            content: stringarg,
            loc: Object {
              source: stringarg,
            },
          },
          exp: Object {
            isStatic: false,
            loc: Object {
              source: bar,
            },
          },
          loc: Object {
            source: stringarg='bar',
          },
          modifiers: Array [
            ,
          ],
          name: bind,
          type: 6,
        },
      ]
    `);
  });
  test('number arg', () => {
    expect(mapAttributesAndDirectives({ numberarg: 2023 })).toMatchInlineSnapshot(`
      Array [
        Object {
          arg: Object {
            content: numberarg,
            loc: Object {
              source: numberarg,
            },
          },
          exp: Object {
            isStatic: false,
            loc: Object {
              source: 2023,
            },
          },
          loc: Object {
            source: :numberarg='2023',
          },
          modifiers: Array [
            ,
          ],
          name: bind,
          type: 6,
        },
      ]
    `);
  });
  test('camelCase boolean, string, and number Args', () => {
    expect(
      mapAttributesAndDirectives({
        camelCaseBooleanArg: true,
        camelCaseStringArg: 'foo',
        cameCaseNumberArg: 2023,
      })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          arg: Object {
            content: camel-case-boolean-arg,
            loc: Object {
              source: camel-case-boolean-arg,
            },
          },
          exp: Object {
            isStatic: false,
            loc: Object {
              source: true,
            },
          },
          loc: Object {
            source: :camel-case-boolean-arg='true',
          },
          modifiers: Array [
            ,
          ],
          name: bind,
          type: 6,
        },
        Object {
          arg: Object {
            content: camel-case-string-arg,
            loc: Object {
              source: camel-case-string-arg,
            },
          },
          exp: Object {
            isStatic: false,
            loc: Object {
              source: foo,
            },
          },
          loc: Object {
            source: camel-case-string-arg='foo',
          },
          modifiers: Array [
            ,
          ],
          name: bind,
          type: 6,
        },
        Object {
          arg: Object {
            content: came-case-number-arg,
            loc: Object {
              source: came-case-number-arg,
            },
          },
          exp: Object {
            isStatic: false,
            loc: Object {
              source: 2023,
            },
          },
          loc: Object {
            source: :came-case-number-arg='2023',
          },
          modifiers: Array [
            ,
          ],
          name: bind,
          type: 6,
        },
      ]
    `);
  });
});

describe('Vue3: sourceDecorator->generateAttributesSource()', () => {
  test('camelCase boolean Arg', () => {
    expect(
      generateAttributesSource(
        mapAttributesAndDirectives({ camelCaseBooleanArg: true }),
        { camelCaseBooleanArg: true },
        [{ camelCaseBooleanArg: { type: 'boolean' } }] as ArgsType<Args>
      )
    ).toMatchInlineSnapshot(`:camel-case-boolean-arg='true'`);
  });
  test('camelCase string Arg', () => {
    expect(
      generateAttributesSource(
        mapAttributesAndDirectives({ camelCaseStringArg: 'foo' }),
        { camelCaseStringArg: 'foo' },
        [{ camelCaseStringArg: { type: 'string' } }] as ArgsType<Args>
      )
    ).toMatchInlineSnapshot(`camel-case-string-arg='foo'`);
  });

  test('camelCase boolean, string, and number Args', () => {
    expect(
      generateAttributesSource(
        mapAttributesAndDirectives({
          camelCaseBooleanArg: true,
          camelCaseStringArg: 'foo',
          cameCaseNumberArg: 2023,
        }),
        {
          camelCaseBooleanArg: true,
          camelCaseStringArg: 'foo',
          cameCaseNumberArg: 2023,
        },
        [] as ArgsType<Args>
      )
    ).toMatchInlineSnapshot(
      `:camel-case-boolean-arg='true' camel-case-string-arg='foo' :came-case-number-arg='2023'`
    );
  });
});

describe('generateSource snippet Vue3', () => {});
