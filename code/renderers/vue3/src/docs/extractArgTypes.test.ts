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
import type { Mock } from 'vitest';
import { describe, expect, it, vitest } from 'vitest';

vitest.mock('@storybook/docs-tools');

describe('extractArgTypes', () => {
  it('should return null if component does not contain docs', () => {
    (hasDocgen as Mock).mockReturnValueOnce(false);
    (extractComponentProps as Mock).mockReturnValueOnce([] as any);

    expect(extractArgTypes({} as any)).toBeNull();
  });

  it('should extract arg types for component', () => {
    const component = referenceTypeProps;
    (hasDocgen as Mock).mockReturnValueOnce(true);
    (extractComponentProps as Mock).mockReturnValue(mockExtractComponentPropsReturn);

    const argTypes = extractArgTypes(component);

    expect(argTypes).toMatchInlineSnapshot(`
      {
        "array": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "description required array object",
          "name": "array",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": "MyNestedProps[]",
            },
          },
          "type": {
            "name": "MyNestedProps[]",
            "required": true,
          },
        },
        "arrayOptional": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "description optional array object",
          "name": "arrayOptional",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": "MyNestedProps[]",
            },
          },
          "type": {
            "name": "MyNestedProps[] | undefined",
            "required": false,
          },
        },
        "bar": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": "1",
          },
          "description": "description bar is optional number",
          "name": "bar",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": "1",
            },
            "jsDocTags": [],
            "type": {
              "summary": "number",
            },
          },
          "type": {
            "name": "number | undefined",
            "required": false,
          },
        },
        "baz": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": "["foo", "bar"]",
          },
          "description": "description baz is string array",
          "name": "baz",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": "["foo", "bar"]",
            },
            "jsDocTags": [],
            "type": {
              "summary": "string[]",
            },
          },
          "type": {
            "name": "string[] | undefined",
            "required": false,
          },
        },
        "enumValue": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "description enum value",
          "name": "enumValue",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": "MyEnum",
            },
          },
          "type": {
            "name": "MyEnum",
            "required": true,
          },
        },
        "foo": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "@default: "rounded"<br>@since: v1.0.0<br>@see: https://vuejs.org/<br>@deprecated: v1.1.0<br><br>string foo",
          "name": "foo",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [
              {
                "name": "default",
                "text": ""rounded"",
              },
              {
                "name": "since",
                "text": "v1.0.0",
              },
              {
                "name": "see",
                "text": "https://vuejs.org/",
              },
              {
                "name": "deprecated",
                "text": "v1.1.0",
              },
            ],
            "type": {
              "summary": "string",
            },
          },
          "type": {
            "name": "string",
            "required": true,
          },
        },
        "inlined": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "",
          "name": "inlined",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": "{ foo: string; }",
            },
          },
          "type": {
            "name": "{ foo: string; }",
            "required": true,
          },
        },
        "literalFromContext": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "description literal type alias that require context",
          "name": "literalFromContext",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": ""Uncategorized" | "Content" | "Interaction" | "Display" | "Forms" | "Addons"",
            },
          },
          "type": {
            "name": ""Uncategorized" | "Content" | "Interaction" | "Display" | "Forms" | "Addons"",
            "required": true,
          },
        },
        "nested": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "description nested is required nested object",
          "name": "nested",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": "MyNestedProps",
            },
          },
          "type": {
            "name": "MyNestedProps",
            "required": true,
          },
        },
        "nestedIntersection": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "description required nested object with intersection",
          "name": "nestedIntersection",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": "MyNestedProps & { additionalProp: string; }",
            },
          },
          "type": {
            "name": "MyNestedProps & { additionalProp: string; }",
            "required": true,
          },
        },
        "nestedOptional": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "description optional nested object",
          "name": "nestedOptional",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": "MyNestedProps | MyIgnoredNestedProps",
            },
          },
          "type": {
            "name": "MyNestedProps | MyIgnoredNestedProps | undefined",
            "required": false,
          },
        },
        "recursive": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "",
          "name": "recursive",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": "MyNestedRecursiveProps",
            },
          },
          "type": {
            "name": "MyNestedRecursiveProps",
            "required": true,
          },
        },
        "union": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "description union is required union type",
          "name": "union",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": "string | number",
            },
          },
          "type": {
            "name": "string | number",
            "required": true,
          },
        },
        "unionOptional": {
          "control": {
            "disable": true,
          },
          "defaultValue": {
            "summary": undefined,
          },
          "description": "description unionOptional is optional union type",
          "name": "unionOptional",
          "table": {
            "category": "events",
            "defaultValue": {
              "summary": undefined,
            },
            "jsDocTags": [],
            "type": {
              "summary": "string | number",
            },
          },
          "type": {
            "name": "string | number | undefined",
            "required": false,
          },
        },
      }
    `);
  });

  it('should extract events for Vue component', () => {
    const component = referenceTypeEvents;
    (hasDocgen as Mock).mockReturnValueOnce(true);
    (extractComponentProps as Mock).mockReturnValue(mockExtractComponentEventsReturn);

    const argTypes = extractArgTypes(component);

    expect(argTypes).toMatchSnapshot();
  });

  it('should extract slots type for Vue component', () => {
    const component = templateSlots;
    (hasDocgen as Mock).mockReturnValueOnce(true);
    (extractComponentProps as Mock).mockReturnValue(mockExtractComponentSlotsReturn);

    const argTypes = extractArgTypes(component);

    expect(argTypes).toMatchSnapshot();
  });
});
