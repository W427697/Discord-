import { hasDocgen, extractComponentProps } from '@storybook/docs-tools';
import { extractArgTypes } from './extractArgTypes';
import {
  mockExtractComponentPropsReturn,
  referenceTypeProps,
  mockExtractComponentEventsReturn,
  referenceTypeEvents,
  templateSlots,
  mockExtractComponentSlotsReturn,
} from './tests-meta-components/meta-components';

jest.mock('@storybook/docs-tools');

describe('extractArgTypes', () => {
  it('should return null if component does not contain docs', () => {
    (hasDocgen as jest.Mock).mockReturnValueOnce(false);
    (extractComponentProps as jest.Mock).mockReturnValueOnce([] as any);

    expect(extractArgTypes({} as any)).toBeNull();
  });

  it('should extract arg types for component', () => {
    const component = referenceTypeProps;
    (hasDocgen as jest.Mock).mockReturnValueOnce(true);
    (extractComponentProps as jest.Mock).mockReturnValue(mockExtractComponentPropsReturn);

    const argTypes = extractArgTypes(component);

    expect(argTypes).toMatchInlineSnapshot(`
      Object {
        "array": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "description required array object",
          "name": "array",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "MyNestedProps[]",
            },
          },
          "type": Object {
            "name": "MyNestedProps[]",
            "required": true,
          },
        },
        "arrayOptional": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "description optional array object",
          "name": "arrayOptional",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "MyNestedProps[]",
            },
          },
          "type": Object {
            "name": "MyNestedProps[] | undefined",
            "required": false,
          },
        },
        "bar": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": "1",
          },
          "description": "description bar is optional number",
          "name": "bar",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": "1",
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "number",
            },
          },
          "type": Object {
            "name": "number | undefined",
            "required": false,
          },
        },
        "baz": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": "[\\"foo\\", \\"bar\\"]",
          },
          "description": "description baz is string array",
          "name": "baz",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": "[\\"foo\\", \\"bar\\"]",
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "string[]",
            },
          },
          "type": Object {
            "name": "string[] | undefined",
            "required": false,
          },
        },
        "enumValue": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "description enum value",
          "name": "enumValue",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "MyEnum",
            },
          },
          "type": Object {
            "name": "MyEnum",
            "required": true,
          },
        },
        "foo": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "@default: \\"rounded\\"<br>@since: v1.0.0<br>@see: https://vuejs.org/<br>@deprecated: v1.1.0<br><br>string foo",
          "name": "foo",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [
              Object {
                "name": "default",
                "text": "\\"rounded\\"",
              },
              Object {
                "name": "since",
                "text": "v1.0.0",
              },
              Object {
                "name": "see",
                "text": "https://vuejs.org/",
              },
              Object {
                "name": "deprecated",
                "text": "v1.1.0",
              },
            ],
            "type": Object {
              "summary": "string",
            },
          },
          "type": Object {
            "name": "string",
            "required": true,
          },
        },
        "inlined": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "",
          "name": "inlined",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "{ foo: string; }",
            },
          },
          "type": Object {
            "name": "{ foo: string; }",
            "required": true,
          },
        },
        "literalFromContext": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "description literal type alias that require context",
          "name": "literalFromContext",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "\\"Uncategorized\\" | \\"Content\\" | \\"Interaction\\" | \\"Display\\" | \\"Forms\\" | \\"Addons\\"",
            },
          },
          "type": Object {
            "name": "\\"Uncategorized\\" | \\"Content\\" | \\"Interaction\\" | \\"Display\\" | \\"Forms\\" | \\"Addons\\"",
            "required": true,
          },
        },
        "nested": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "description nested is required nested object",
          "name": "nested",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "MyNestedProps",
            },
          },
          "type": Object {
            "name": "MyNestedProps",
            "required": true,
          },
        },
        "nestedIntersection": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "description required nested object with intersection",
          "name": "nestedIntersection",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "MyNestedProps & { additionalProp: string; }",
            },
          },
          "type": Object {
            "name": "MyNestedProps & { additionalProp: string; }",
            "required": true,
          },
        },
        "nestedOptional": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "description optional nested object",
          "name": "nestedOptional",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "MyNestedProps | MyIgnoredNestedProps",
            },
          },
          "type": Object {
            "name": "MyNestedProps | MyIgnoredNestedProps | undefined",
            "required": false,
          },
        },
        "recursive": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "",
          "name": "recursive",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "MyNestedRecursiveProps",
            },
          },
          "type": Object {
            "name": "MyNestedRecursiveProps",
            "required": true,
          },
        },
        "union": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "description union is required union type",
          "name": "union",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "string | number",
            },
          },
          "type": Object {
            "name": "string | number",
            "required": true,
          },
        },
        "unionOptional": Object {
          "control": Object {
            "disable": true,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "description unionOptional is optional union type",
          "name": "unionOptional",
          "table": Object {
            "category": "events",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "string | number",
            },
          },
          "type": Object {
            "name": "string | number | undefined",
            "required": false,
          },
        },
      }
    `);
  });

  it('should extract events for Vue component', () => {
    const component = referenceTypeEvents;
    (hasDocgen as jest.Mock).mockReturnValueOnce(true);
    (extractComponentProps as jest.Mock).mockReturnValue(mockExtractComponentEventsReturn);

    const argTypes = extractArgTypes(component);

    expect(argTypes).toMatchInlineSnapshot(`
      Object {
        "bar": Object {
          "control": Object {
            "disable": false,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "",
          "name": "bar",
          "table": Object {
            "category": "props",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "[value: { year: number; title?: any; }]",
            },
          },
          "type": Object {
            "name": Array [
              Object {
                "kind": "object",
                "schema": Object {
                  "title": Object {
                    "declarations": Array [
                      Object {
                        "file": "/storybook/sandbox/vue3-vite-default-ts/src/stories/renderers/vue3/component-meta/reference-type-events/component.vue",
                        "range": Array [
                          269,
                          280,
                        ],
                      },
                    ],
                    "description": "",
                    "global": false,
                    "name": "title",
                    "required": false,
                    "schema": "any",
                    "tags": Array [],
                    "type": "any",
                  },
                  "year": Object {
                    "declarations": Array [
                      Object {
                        "file": "/storybook/sandbox/vue3-vite-default-ts/src/stories/renderers/vue3/component-meta/reference-type-events/component.vue",
                        "range": Array [
                          255,
                          268,
                        ],
                      },
                    ],
                    "description": "",
                    "global": false,
                    "name": "year",
                    "required": true,
                    "schema": "number",
                    "tags": Array [],
                    "type": "number",
                  },
                },
                "type": "{ year: number; title?: any; }",
              },
            ],
            "required": undefined,
          },
        },
        "baz": Object {
          "control": Object {
            "disable": false,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "",
          "name": "baz",
          "table": Object {
            "category": "props",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "[]",
            },
          },
          "type": Object {
            "name": Array [],
            "required": undefined,
          },
        },
        "foo": Object {
          "control": Object {
            "disable": false,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "",
          "name": "foo",
          "table": Object {
            "category": "props",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "[data?: { foo: string; }]",
            },
          },
          "type": Object {
            "name": Array [
              Object {
                "kind": "enum",
                "schema": Array [
                  "undefined",
                  Object {
                    "kind": "object",
                    "schema": Object {
                      "foo": Object {
                        "declarations": Array [
                          Object {
                            "file": "/storybook/sandbox/vue3-vite-default-ts/src/stories/renderers/vue3/component-meta/reference-type-events/component.vue",
                            "range": Array [
                              207,
                              218,
                            ],
                          },
                        ],
                        "description": "",
                        "global": false,
                        "name": "foo",
                        "required": true,
                        "schema": "string",
                        "tags": Array [],
                        "type": "string",
                      },
                    },
                    "type": "{ foo: string; }",
                  },
                ],
                "type": "{ foo: string; } | undefined",
              },
            ],
            "required": undefined,
          },
        },
      }
    `);
  });

  it('should extract slots type for Vue component', () => {
    const component = templateSlots;
    (hasDocgen as jest.Mock).mockReturnValueOnce(true);
    (extractComponentProps as jest.Mock).mockReturnValue(mockExtractComponentSlotsReturn);

    const argTypes = extractArgTypes(component);

    expect(argTypes).toMatchInlineSnapshot(`
      Object {
        "default": Object {
          "control": Object {
            "disable": false,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "",
          "name": "default",
          "table": Object {
            "category": "props",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "{ num: number; }",
            },
          },
          "type": Object {
            "name": "object",
            "required": undefined,
            "value": Object {
              "num": Object {
                "declarations": Array [],
                "description": "",
                "global": false,
                "name": "num",
                "required": true,
                "schema": "number",
                "tags": Array [],
                "type": "number",
              },
            },
          },
        },
        "named": Object {
          "control": Object {
            "disable": false,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "",
          "name": "named",
          "table": Object {
            "category": "props",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "{ str: string; }",
            },
          },
          "type": Object {
            "name": "object",
            "required": undefined,
            "value": Object {
              "str": Object {
                "declarations": Array [],
                "description": "",
                "global": false,
                "name": "str",
                "required": true,
                "schema": "string",
                "tags": Array [],
                "type": "string",
              },
            },
          },
        },
        "no-bind": Object {
          "control": Object {
            "disable": false,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "",
          "name": "no-bind",
          "table": Object {
            "category": "props",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "{}",
            },
          },
          "type": Object {
            "name": "object",
            "required": undefined,
            "value": Object {},
          },
        },
        "vbind": Object {
          "control": Object {
            "disable": false,
          },
          "defaultValue": Object {
            "summary": undefined,
          },
          "description": "",
          "name": "vbind",
          "table": Object {
            "category": "props",
            "defaultValue": Object {
              "summary": undefined,
            },
            "jsDocTags": Array [],
            "type": Object {
              "summary": "{ num: number; str: string; }",
            },
          },
          "type": Object {
            "name": "object",
            "required": undefined,
            "value": Object {
              "num": Object {
                "declarations": Array [
                  Object {
                    "file": "/storybook/sandbox/vue3-vite-default-ts/src/stories/renderers/vue3/component-meta/template-slots/component.vue",
                    "range": Array [
                      153,
                      161,
                    ],
                  },
                ],
                "description": "",
                "global": false,
                "name": "num",
                "required": true,
                "schema": "number",
                "tags": Array [],
                "type": "number",
              },
              "str": Object {
                "declarations": Array [
                  Object {
                    "file": "/storybook/sandbox/vue3-vite-default-ts/src/stories/renderers/vue3/component-meta/template-slots/component.vue",
                    "range": Array [
                      163,
                      173,
                    ],
                  },
                ],
                "description": "",
                "global": false,
                "name": "str",
                "required": true,
                "schema": "string",
                "tags": Array [],
                "type": "string",
              },
            },
          },
        },
      }
    `);
  });
});
