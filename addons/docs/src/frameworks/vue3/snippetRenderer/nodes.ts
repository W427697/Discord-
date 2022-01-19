/* eslint default-case: "off", consistent-return: "off" */
export enum NodeTypes {
  Text = 0,
  Element,
  Component,
  Interpolation,
  Expression,
  Attribute,
  Directive,
}

// -- Type Definition

export type Node =
  | TextNode
  | ElementNode
  | ComponentNode
  | InterpolationNode
  | ExpressionNode
  | AttributeNode
  | DirectiveNode;

/**
 * Nodes that can be placed as a child of some other node.
 */
export type ChildNode = TextNode | ElementNode | ComponentNode | InterpolationNode;

/**
 * TextFragment.
 */
export interface TextNode {
  type: NodeTypes.Text;
  text: string;
}

/**
 * HTML element, such as `<a>` or Custom Element.
 */
export interface ElementNode {
  type: NodeTypes.Element;

  isSelfClosable: boolean;

  tagName: string;

  props: (AttributeNode | DirectiveNode)[];

  children: ChildNode[];
}

/**
 * Vue component.
 */
export interface ComponentNode {
  type: NodeTypes.Component;

  componentName: string;

  props: (AttributeNode | DirectiveNode)[];

  children: ChildNode[];
}

/**
 * Text interpolation. (`{{ foo }}`)
 */
export interface InterpolationNode {
  type: NodeTypes.Interpolation;

  expression: ExpressionNode;
}

export interface ExpressionNode {
  type: NodeTypes.Expression;

  content: string;
}

export interface AttributeNode {
  type: NodeTypes.Attribute;

  name: string;

  value: string;
}

export interface DirectiveNode {
  type: NodeTypes.Directive;

  name: string;

  argument: string | null;

  modifiers: string[];

  value: ExpressionNode | null;
}

// -- Implementation

export interface SerializeOptions {
  componentCasing: 'as-is' | 'kebab' | 'pascal';

  shorthand: {
    bind: boolean;
    on: boolean;
    slot: boolean;
  };

  indent: number;

  outerWrapThreshold: number;
  innerWrapThreshold: number;
}

export function serialize(node: Node, options: SerializeOptions): string {
  switch (node.type) {
    case NodeTypes.Text:
      return node.text;
    case NodeTypes.Interpolation:
      return `{{ ${serialize(node.expression, options)} }}`;
    case NodeTypes.Expression:
      return node.content;
    case NodeTypes.Attribute:
      // TODO: Escape characters (only double quote?)
      return `${node.name}="${node.value}"`;
    case NodeTypes.Directive: {
      const arg = typeof node.argument === 'string' ? node.argument : '';

      // attribute-only binding (`<foo bar />`, which is shorthand of `<foo :bar="true" />`)
      if (
        node.name === 'bind' &&
        node.argument &&
        node.modifiers.length === 0 &&
        node.value &&
        node.value.content === 'true'
      ) {
        return node.argument;
      }

      let name = `v-${node.name}${arg ? ':' : ''}`;

      // Rewrite to shorthand if argument present.
      if (node.argument) {
        switch (node.name) {
          case 'bind':
            if (options.shorthand.bind) {
              name = ':';
            }
            break;
          case 'on':
            if (options.shorthand.on) {
              name = '@';
            }
            break;
          case 'slot':
            if (options.shorthand.slot) {
              name = '#';
            }
            break;
        }
      }

      const modifiers = node.modifiers.map((m) => `.${m}`).join('');

      // TODO: Escape characters
      const value = node.value ? `="${serialize(node.value, options)}"` : '';

      return name + arg + modifiers + value;
    }
    case NodeTypes.Component:
    case NodeTypes.Element: {
      const tagName =
        node.type === NodeTypes.Component
          ? forceComponentNameCasing(node.componentName, options.componentCasing)
          : node.tagName;

      const children = node.children.map((child) => serialize(child, options));

      const props = node.props.map((prop) => serialize(prop, options));

      const isSelfClosing =
        (node.type === NodeTypes.Component || node.isSelfClosable) && children.length === 0;

      // FIXME: More smart wrapping, please
      const outerLength = isSelfClosing
        ? // 4 ... `<` + `/>` + space after the tag name
          tagName.length + 4 + props.join(' ').length
        : // x ... `<` + `>` + `</` + `>`
          tagName.length * 2 + 5 + props.join(' ').length;

      const needsOuterWrap = outerLength > options.outerWrapThreshold;
      const [start, end] = needsOuterWrap
        ? [
            `<${tagName}\n${props.map((str) => `${' '.repeat(options.indent) + str}\n`).join('')}>`,
            `</${tagName}>`,
          ]
        : [`<${tagName}${props.map((str) => ` ${str}`).join('')}>`, `</${tagName}>`];

      if (isSelfClosing) {
        return `${start.slice(0, -1)}/>`;
      }

      const needsInnerWrap =
        needsOuterWrap ||
        children.some((str) => str.indexOf('\n') > -1) ||
        children.reduce((total, str) => total + str.length, 0) > options.innerWrapThreshold;
      if (needsInnerWrap) {
        return `${start}\n${children
          .map((str) => `${' '.repeat(options.indent) + str}\n`)
          .join('')}${end}`;
      }

      return start + children.join('') + end;
    }
  }
}

function forceComponentNameCasing(name: string, mode: SerializeOptions['componentCasing']): string {
  switch (mode) {
    case 'as-is':
      return name;
    case 'kebab':
      return name
        .replace(/([A-Z])/g, '-$1')
        .replace(/^-/, '')
        .toLowerCase();
    case 'pascal':
      return name
        .split('-')
        .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1))
        .join('');
  }
}
