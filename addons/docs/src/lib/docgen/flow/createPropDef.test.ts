import { createFlowPropDef } from './createPropDef';
import { DocgenInfo } from '../types';

const PROP_NAME = 'propName';

function createDocgenInfo({ flowType, ...others }: Partial<DocgenInfo>): DocgenInfo {
  return {
    flowType,
    required: false,
    ...others,
  };
}

describe('type', () => {
  ['string', 'number', 'boolean', 'any', 'void', 'Object', 'String', 'MyClass', 'literal'].forEach(
    (x) => {
      it(`should support ${x}`, () => {
        const docgenInfo = createDocgenInfo({
          flowType: { name: x },
        });

        const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

        expect(type.summary).toBe(x);
        expect(type.detail).toBeUndefined();
      });
    }
  );

  ['Array', 'Class', 'MyClass'].forEach((x) => {
    it(`should support untyped ${x}`, () => {
      const docgenInfo = createDocgenInfo({
        flowType: { name: x },
      });

      const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

      expect(type.summary).toBe(x);
      expect(type.detail).toBeUndefined();
    });

    it(`should support typed ${x}`, () => {
      const docgenInfo = createDocgenInfo({
        flowType: {
          name: x,
          elements: [
            {
              name: 'any',
            },
          ],
          raw: `${x}<any>`,
        },
      });

      const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

      expect(type.summary).toBe(`${x}<any>`);
      expect(type.detail).toBeUndefined();
    });
  });

  it('should support short object signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw: '{ foo: string, bar?: mixed }',
        signature: {
          properties: [
            {
              key: 'foo',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'bar',
              value: {
                name: 'mixed',
                required: false,
              },
            },
          ],
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('{ foo: string, bar?: mixed }');
    expect(type.detail).toBeUndefined();
  });

  it('should support long object signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw:
          '{ (x: string): void, prop1: string, prop2: string, prop3: string, prop4: string, prop5: string, prop6: string, prop7: string, prop8: string }',
        signature: {
          properties: [
            {
              key: 'prop1',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop2',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop3',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop4',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop5',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop6',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop7',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop8',
              value: {
                name: 'string',
                required: true,
              },
            },
          ],
          constructor: {
            name: 'signature',
            type: 'function',
            raw: '(x: string): void',
            signature: {
              arguments: [
                {
                  name: 'x',
                  type: {
                    name: 'string',
                  },
                },
              ],
              return: {
                name: 'void',
              },
            },
          },
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('object');
    expect(type.detail).toBe(
      '{ (x: string): void, prop1: string, prop2: string, prop3: string, prop4: string, prop5: string, prop6: string, prop7: string, prop8: string }'
    );
  });

  it('should support func signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'function',
        raw: '(x: string) => void',
        signature: {
          arguments: [
            {
              name: 'x',
              type: {
                name: 'string',
              },
            },
          ],
          return: {
            name: 'void',
          },
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('(x: string) => void');
    expect(type.detail).toBeUndefined();
  });

  it('should support tuple', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'tuple',
        raw: '[foo, "value", number]',
        elements: [
          {
            name: 'foo',
          },
          {
            name: 'literal',
            value: '"value"',
          },
          {
            name: 'number',
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('[foo, "value", number]');
  });

  it('should support union', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        raw: 'number | string',
        elements: [
          {
            name: 'number',
          },
          {
            name: 'string',
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('number | string');
  });

  it('should support nested union elements', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        raw: '"minimum" | "maximum" | UserSize',
        elements: [
          {
            name: 'literal',
            value: '"minimum"',
          },
          {
            name: 'literal',
            value: '"maximum"',
          },
          {
            name: 'union',
            raw: 'string | number',
            elements: [
              {
                name: 'number',
              },
              {
                name: 'string',
              },
            ],
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('"minimum" | "maximum" | number | string');
  });

  it('uses raw union value if elements are missing', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        raw: '"minimum" | "maximum" | UserSize',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('"minimum" | "maximum" | UserSize');
  });

  it('removes a leading | if raw union value is used', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        raw: '| "minimum" | "maximum" | UserSize',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('"minimum" | "maximum" | UserSize');
  });

  it('even removes extra spaces after a leading | if raw union value is used', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        raw: '|     "minimum" | "maximum" | UserSize',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('"minimum" | "maximum" | UserSize');
  });

  it('should support intersection', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'intersection',
        raw: 'number & string',
        elements: [
          {
            name: 'number',
          },
          {
            name: 'string',
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('number & string');
  });
});

const properties1 = [
  {
    key: 'prop1',
    value: { name: 'string', required: true },
  },
];
const properties2 = [
  {
    key: 'prop2',
    value: { name: 'string', required: true },
  },
  {
    key: 'prop3',
    value: { name: 'string', required: true },
  },
  {
    key: 'prop4',
    value: { name: 'string', required: true },
  },
  {
    key: 'prop5',
    value: { name: 'string', required: true },
  },
  {
    key: 'prop6',
    value: { name: 'string', required: true },
  },
];
const properties3 = [
  {
    key: 'prop7',
    value: { name: 'string', required: false },
  },
];
const elements1 = [
  { name: 'literal', value: '"north"' },
  { name: 'literal', value: '"south"' },
  { name: 'literal', value: '"east"' },
  { name: 'literal', value: '"west"' },
];
const elements2 = [
  { name: 'literal', value: '"northeast"' },
  { name: 'literal', value: '"northwest"' },
  { name: 'literal', value: '"southeast"' },
  { name: 'literal', value: '"southwest"' },
];
const elements3 = [
  {
    name: 'signature',
    type: 'object',
    signature: {
      properties: properties1,
    },
  },
];
const arguments1 = [
  {
    name: 'arg1',
    type: { name: 'string' },
  },
];

describe('summary', () => {
  it('prefers generated summary when not too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'Array',
        raw: 'Array<Direction>',
        elements: [
          {
            name: 'union',
            elements: elements1,
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Array<"north" | "south" | "east" | "west">');
  });

  it('uses `raw` for summary if generated details are too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'Array',
        raw: 'Array<Direction>',
        elements: [
          {
            name: 'union',
            elements: [...elements1, ...elements2],
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Array<Direction>');
  });

  it('falls back to `type` for summary if details/raw are too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw:
          '{ prop1: string, prop2: string, prop3: string, prop4: string, prop5: string, prop6: string }',
        signature: {
          properties: [...properties1, ...properties2],
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('object');
  });

  it('falls back to `type` for summary if no `raw` & details are too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        signature: {
          properties: [...properties1, ...properties2],
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('object');
  });

  it('falls back to `name` for summary if no `type` & details/raw are too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'Array',
        raw:
          'Array<"north" | "northeast" | "northwest" | "south" | "southeast" | "southwest" | "east" | "west">',
        elements: [
          {
            name: 'union',
            elements: [...elements1, ...elements2],
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Array');
  });

  it('falls back to `name` for summary if no `type` or `raw` & details are too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'Array',
        elements: [
          {
            name: 'union',
            elements: [...elements1, ...elements2],
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Array');
  });
});

describe('literals', () => {
  it('falls back to `name` if no value', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'literal',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('literal');
    expect(type.detail).toBeUndefined();
  });

  it('uses the `value` if available', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'literal',
        value: '"foobar"',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('"foobar"');
    expect(type.detail).toBeUndefined();
  });
});

describe('union generation', () => {
  it('falls back to `raw` if no elements', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        raw: 'Directions',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Directions');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to `raw` if empty elements', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        raw: 'Directions',
        elements: [],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Directions');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to `name` if no elements nor raw', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('union');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to `name` if empty elements & no raw', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        elements: [],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('union');
    expect(type.detail).toBeUndefined();
  });

  it('detects characters that will make it "unsafe to split" in ArgsTable', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        raw: 'Directions | { prop1: string }',
        elements: [...elements1, ...elements3],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Directions | { prop1: string }');
    expect(type.detail).toBe('"north" | "south" | "east" | "west" | { prop1: string }');
  });

  // This is because they are split into tokens by ArgsTable
  it('never checks the generated details for being too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        raw: 'Directions',
        elements: [...elements1, ...elements2],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe(
      '"north" | "south" | "east" | "west" | "northeast" | "northwest" | "southeast" | "southwest"'
    );
    expect(type.detail).toBeUndefined();
  });
});

describe('intersection generation', () => {
  it('falls back to `raw` if no elements', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'intersection',
        raw: 'Directions',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Directions');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to `raw` if empty elements', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'intersection',
        raw: 'Directions',
        elements: [],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Directions');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to `name` if no elements nor raw', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'intersection',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('intersection');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to `name` if empty elements & no raw', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'intersection',
        elements: [],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('intersection');
    expect(type.detail).toBeUndefined();
  });

  it('never checks the generated details for being too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'intersection',
        raw: 'Directions',
        elements: [...elements1, ...elements2],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe(
      '"north" & "south" & "east" & "west" & "northeast" & "northwest" & "southeast" & "southwest"'
    );
    expect(type.detail).toBeUndefined();
  });
});

describe('array generation', () => {
  it('falls back to `raw` if no elements', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'Array',
        raw: 'Array<Direction>',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Array<Direction>');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to `raw` if empty elements', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'Array',
        raw: 'Array<Direction>',
        elements: [],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Array<Direction>');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to `name` if no elements nor raw', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'Array',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Array');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to `name` if empty elements & no raw', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'Array',
        elements: [],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Array');
    expect(type.detail).toBeUndefined();
  });

  it('can use generated value for summary', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'Array',
        raw: 'Array<Direction>',
        elements: [
          {
            name: 'union',
            elements: elements1,
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Array<"north" | "south" | "east" | "west">');
    expect(type.detail).toBeUndefined();
  });

  it('uses generated value for details if too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'Array',
        raw: 'Array<Direction>',
        elements: [
          {
            name: 'union',
            elements: [...elements1, ...elements2],
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('Array<Direction>');
    expect(type.detail).toBe(
      'Array<"north" | "south" | "east" | "west" | "northeast" | "northwest" | "southeast" | "southwest">'
    );
  });
});

describe('object generation', () => {
  it('falls back to `raw` if no signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw: '{}',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('{}');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to empty object literal if no signature nor raw', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('{}');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to empty object literal if no parameters in signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw: '{\n\n}',
        signature: {},
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('{}');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to empty object literal if empty parameters in signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw: '{\n\n}',
        signature: {
          parameters: [],
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('{}');
    expect(type.detail).toBeUndefined();
  });

  it('can use generated value for summary', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw: '{ prop1: StringAlias }',
        signature: {
          properties: properties1,
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('{ prop1: string }');
    expect(type.detail).toBeUndefined();
  });

  it('uses generated value for details if too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw: '{ prop1: string, ...otherProps }',
        signature: {
          properties: [...properties1, ...properties2],
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('{ prop1: string, ...otherProps }');
    expect(type.detail).toBe(
      '{ prop1: string, prop2: string, prop3: string, prop4: string, prop5: string, prop6: string }'
    );
  });

  it('also generates requiredness on properties', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw: '{ prop1: string, prop7?: string }',
        signature: {
          properties: [...properties1, ...properties3],
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('{ prop1: string, prop7?: string }');
    expect(type.detail).toBeUndefined();
  });
});

describe('function generation', () => {
  it('falls back to `raw` if no signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'function',
        raw: '(foo) => bar',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('(foo) => bar');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to void arrow function if no signature nor raw', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'function',
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('() => void');
    expect(type.detail).toBeUndefined();
  });

  it('falls back to void arrow function if no arguments or return in signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'function',
        raw: '(foo) => bar',
        signature: {},
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('() => void');
    expect(type.detail).toBeUndefined();
  });

  it('does not need arguments in signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'function',
        raw: '() => bar',
        signature: {
          return: { name: 'string' },
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('() => string');
    expect(type.detail).toBeUndefined();
  });

  it('can use generated value for summary', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'function',
        raw: '(foo) => bar',
        signature: {
          arguments: arguments1,
          return: { name: 'string' },
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('(arg1: string) => string');
    expect(type.detail).toBeUndefined();
  });

  it('uses generated value for details if too long', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'function',
        raw: '(arg: BigObjProp) => string',
        signature: {
          arguments: [
            {
              name: 'arg',
              type: {
                name: 'signature',
                type: 'object',
                raw: '{ prop1: string, ...otherProps }',
                signature: {
                  properties: [...properties1, ...properties2],
                },
              },
            },
          ],
          return: { name: 'string' },
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('(arg: BigObjProp) => string');
    expect(type.detail).toBe(
      '(arg: { prop1: string, prop2: string, prop3: string, prop4: string, prop5: string, prop6: string }) => string'
    );
  });
});
