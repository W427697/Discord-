/* eslint default-case: "off" */

import { VNode, Fragment, Text, isVNode, VNodeNormalizedChildren } from '@vue/runtime-core';

import type * as Nodes from './nodes';
import { NodeTypes } from './nodes';

export function vnodeToInternalNode(vnode: VNode): Nodes.ChildNode[] {
  // Not sure how to handle this structure, ignore
  if (isVNode(vnode.type)) {
    return [];
  }

  // Native element (e.g. `<p>`, `<my-custom-element>`)
  if (typeof vnode.type === 'string') {
    return [
      {
        type: NodeTypes.Element,
        tagName: vnode.type,
        // Detecting self-closing tag needs a list of native HTML tags. Probably not worth it.
        isSelfClosable: false,
        props: vnodePropsToInternalNodes(vnode.props),
        children: vnode.children ? vnodeChildrenToInternalNodes(vnode.children, vnode) : [],
      },
    ];
  }

  if (typeof vnode.type === 'symbol') {
    switch (vnode.type) {
      case Text:
        return [
          {
            type: NodeTypes.Text,
            // Text VNode always have string `children`, safe to skip non-string `children`
            text: typeof vnode.children === 'string' ? vnode.children : '',
          },
        ];
      default:
        // No corresponding Node, ignore
        return [];
    }
  }

  if (vnode.type === Fragment) {
    return vnodeChildrenToInternalNodes(vnode.children, vnode);
  }

  // Component
  if ('name' in vnode.type && vnode.type.name) {
    return [
      {
        type: NodeTypes.Component,
        componentName: vnode.type.name,
        props: vnodePropsToInternalNodes(vnode.props),
        children: vnode.children ? vnodeChildrenToInternalNodes(vnode.children, vnode) : [],
      },
    ];
  }

  // Cannot render snippet without name, skip
  // Most of the time, this is a wrapper component provided by Storybook
  if ((!('name' in vnode.type) || !vnode.type.name) && vnode.component && vnode.component.subTree) {
    return vnodeToInternalNode(vnode.component.subTree);
  }

  // Unknown, ignore
  return [];
}

function vnodePropsToInternalNodes(
  props: VNode['props']
): (Nodes.AttributeNode | Nodes.DirectiveNode)[] {
  if (!props) {
    return [];
  }

  return Object.entries(props).map(([name, value]) => {
    if (typeof value === 'string') {
      return {
        type: NodeTypes.Attribute,
        name,
        value,
      };
    }

    return {
      type: NodeTypes.Directive,
      name: 'bind',
      argument: name,
      modifiers: [],
      value: {
        type: NodeTypes.Expression,
        // FIXME: Better serialization, or should we create `<script>` and declare this as a data property?
        content: JSON.stringify(value).replace(/"/g, "'").replace(/\n/g, '\\n'),
      },
    };
  });
}

function vnodeChildrenToInternalNodes(
  children: VNodeNormalizedChildren,
  parent: VNode
): Nodes.ChildNode[] {
  if (!children) {
    return [];
  }

  if (typeof children === 'string') {
    return [
      {
        type: NodeTypes.Text,
        text: children,
      },
    ];
  }

  if (Array.isArray(children)) {
    return children
      .map<Nodes.ChildNode[]>((child) => {
        switch (typeof child) {
          case 'string':
            return [
              {
                type: NodeTypes.Text,
                text: child,
              },
            ];
          case 'number':
          case 'boolean':
            // Not sure what does this mean, ignore
            return [];
        }

        if (!child) {
          return [];
        }

        if (isVNode(child)) {
          return vnodeToInternalNode(child);
        }

        // Not sure what does this mean, ignore
        return [];
      })
      .flat();
  }

  console.warn(
    'Dynamic Snippet Rendering does no support named slots and scoped slots in render function. Use string template instead.'
  );

  return [];
}

function isNonNull<T>(x: T): x is NonNullable<T> {
  return x !== null && typeof x !== 'undefined';
}
