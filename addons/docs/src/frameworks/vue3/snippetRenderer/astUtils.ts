/* eslint consistent-return: "off", default-case: "off" */

// We use hard coded numbers due to @vue/compiler-core exports these enums as `const enum`
// so we can't use them as we transpile TS files with `--isolatedModules` enabled.
// (re-declare const enum does not work, of course)
// https://github.com/vuejs/core/blob/ae4b0783d78670b6e942ae2a4e3ec6efbbffa158/packages/compiler-core/src/ast.ts#L25

import type * as VueCompiler from '@vue/compiler-core';
import {
  transform,
  isCoreComponent,
  locStub,
  createSimpleExpression,
  createStructuralDirectiveTransform,
} from '@vue/compiler-core';

import * as Nodes from './nodes';

export interface AstConversionOptions {
  /**
   * https://v3.vuejs.org/api/application-config.html#compileroptions-iscustomelement
   */
  isCustomElement(tag: string): boolean;
}

export function astToInternalNodes(
  ast: VueCompiler.RootNode,
  options: AstConversionOptions
): Nodes.Node[] {
  return ast.children
    .map((child) => convertChildNode(child, options))
    .filter((child): child is Nodes.ChildNode => !!child);
}

function convertChildNode(
  ast: VueCompiler.TemplateChildNode,
  options: AstConversionOptions
): Nodes.ChildNode | null {
  switch (ast.type) {
    // ELEMENT
    case 1: {
      const node = ast as VueCompiler.ElementNode;
      const children = (node.children || [])
        .map((child) => convertChildNode(child, options))
        .filter((child): child is Nodes.ChildNode => !!child);

      const isComponent =
        isCoreComponent(node.tag) ||
        (/[A-Z]|-/.test(node.tag) && !options.isCustomElement(node.tag));

      if (isComponent) {
        return {
          type: Nodes.NodeTypes.Component,
          componentName: node.tag,
          props: node.props.map(convertAttrOrDirective).flat(),
          children,
        };
      }

      return {
        type: Nodes.NodeTypes.Element,
        tagName: node.tag,
        props: node.props.map(convertAttrOrDirective).flat(),
        children,
        isSelfClosable: !node.tag.includes('-') && node.isSelfClosing,
      };
    }
    // TEXT
    case 2: {
      return {
        type: Nodes.NodeTypes.Text,
        text: (ast as VueCompiler.TextNode).content,
      };
    }
    // INTERPOLATION
    case 5: {
      const interpolation = ast as VueCompiler.InterpolationNode;

      if (!('content' in interpolation.content)) {
        // Skip compound expression
        // FIXME: implement compound expression serializer
        return null;
      }

      return {
        type: Nodes.NodeTypes.Interpolation,
        expression: convertSimpleExpression(interpolation.content),
      };
    }
    default:
      // Skip unknown nodes
      return null;
  }
}

function convertSimpleExpression(ast: VueCompiler.SimpleExpressionNode): Nodes.ExpressionNode {
  return {
    type: Nodes.NodeTypes.Expression,
    content: ast.content,
  };
}

function convertAttrOrDirective(
  ast: VueCompiler.AttributeNode | VueCompiler.DirectiveNode
): Nodes.AttributeNode | Nodes.DirectiveNode {
  // ATTRIBUTE
  if (ast.type === 6) {
    const attr = ast as VueCompiler.AttributeNode;
    if (!attr.value) {
      // shorthand of `v-bind:foo="true"`
      return {
        type: Nodes.NodeTypes.Directive,
        name: 'bind',
        argument: attr.name,
        modifiers: [],
        value: {
          type: Nodes.NodeTypes.Expression,
          content: 'true',
        },
      };
    }

    return {
      type: Nodes.NodeTypes.Attribute,
      name: attr.name,
      value: attr.value ? attr.value.content : '',
    };
  }

  const directive = ast as VueCompiler.DirectiveNode;
  return {
    type: Nodes.NodeTypes.Directive,
    name: directive.name,
    argument: directive.arg && 'content' in directive.arg ? directive.arg.content : null,
    modifiers: directive.modifiers ?? [],
    value:
      directive.exp && 'content' in directive.exp ? convertSimpleExpression(directive.exp) : null,
  };
}

/**
 * Expand `v-bind="prop"` binding to each `v-bind:foo="bar"` bindings.
 * **This function mutates the `ast` argument.**
 */
export function extractPropBinding(ast: VueCompiler.RootNode, instance: any): void {
  transform(ast, {
    nodeTransforms: [
      createStructuralDirectiveTransform('bind', (node, directive, ctx) => {
        if (!directive.exp || !('content' in directive.exp)) {
          // Skip `v-bind` (invalid) or `v-bind="<CompoundExpression>"` (I don't know what the CompoundExpression is)
          // FIXME: Please remove "(I don't know~)" section from and add explainer of CompoundExpression to above comment
          return;
        }

        // Single property binding (`:foo="bar"`), do not transform
        if (directive.arg && 'content' in directive.arg) {
          // Check if it's possible to resolve the value
          if (shouldResolve(directive.exp.content) && directive.exp.content in instance) {
            const name = directive.arg.content;
            const value = instance[directive.exp.content];

            return () => {
              injectProp(node, name, value);
            };
          }

          return () => {
            node.props.push(directive);
          };
        }

        const target = instance[directive.exp.content];
        if (!target || typeof target !== 'object') {
          // the property does not exist or is not an object, cannot process
          return;
        }

        // We don't need to remove the directive as it's already removed from the `node`
        const entries = Object.entries(target);

        return () => {
          for (let i = 0, l = entries.length; i < l; i += 1) {
            injectProp(node, entries[i][0], entries[i][1]);
          }
        };
      }),
    ],
  });
}

function shouldResolve(content: string): boolean {
  // keywords
  switch (content) {
    case 'true':
    case 'false':
    case 'null':
    case 'undefined':
    case 'NaN':
    case 'Infinity':
      return false;
    default:
      return !(/^\d/.test(content) || /[-+.(/[{<>?!%]/.test(content));
  }
}

function createTextNode(content: string): VueCompiler.TextNode {
  return {
    // https://github.com/vuejs/core/blob/ae4b0783d78670b6e942ae2a4e3ec6efbbffa158/packages/compiler-core/src/ast.ts#L28
    type: 2,
    content,
    loc: locStub,
  };
}

function createAttributeNode(name: string, text?: VueCompiler.TextNode): VueCompiler.AttributeNode {
  return {
    // https://github.com/vuejs/core/blob/ae4b0783d78670b6e942ae2a4e3ec6efbbffa158/packages/compiler-core/src/ast.ts#L32
    type: 6,
    name,
    loc: locStub,
    value: text,
  };
}

function createPropBindingNode(
  propName: string,
  expr: VueCompiler.ExpressionNode
): VueCompiler.DirectiveNode {
  return {
    // https://github.com/vuejs/core/blob/ae4b0783d78670b6e942ae2a4e3ec6efbbffa158/packages/compiler-core/src/ast.ts#L33
    type: 7,
    name: 'bind',
    exp: expr,
    arg: createSimpleExpression(propName, true),
    modifiers: [],
    loc: locStub,
  };
}

/**
 * Inject a component property into Element (native element or component).
 * Complex data types and functions will be ignored.
 */
function injectProp(node: VueCompiler.ElementNode, name: string, value: unknown): void {
  if (typeof value === 'string') {
    node.props.push(createAttributeNode(name, createTextNode(value)));
    return;
  }

  if (typeof value === 'boolean') {
    if (value) {
      // Prop name only
      node.props.push(createAttributeNode(name));
    } else {
      node.props.push(createPropBindingNode(name, createSimpleExpression(String(value), false)));
    }
    return;
  }

  if (typeof value === 'number' || typeof value === 'object') {
    // TODO: More intuitive serialization, rule needs to be defined
    node.props.push(
      createPropBindingNode(
        name,
        createSimpleExpression(JSON.stringify(value).replace(/"/g, "'"), false)
      )
    );
    return;
  }

  if (typeof value === 'symbol') {
    // TODO: How should we handle Symbol?
    node.props.push(createAttributeNode(name, createTextNode('<Symbol>')));
  }

  // Skip exotic objects, functions.
}
