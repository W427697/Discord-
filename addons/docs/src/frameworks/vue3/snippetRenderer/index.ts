import { baseParse } from '@vue/compiler-core';
import type { ComponentInternalInstance, VNode } from '@vue/runtime-core';

import { astToInternalNodes, AstConversionOptions, extractPropBinding } from './astUtils';
import { serialize, SerializeOptions, Node } from './nodes';
import { vnodeToInternalNode } from './vnodeUtils';

interface RenderingOptions extends SerializeOptions, AstConversionOptions {}

const defaultOptions: RenderingOptions = {
  componentCasing: 'as-is',
  shorthand: {
    bind: true,
    on: true,
    // This is turned off due to the current syntax highlighting not working with `#` shorthand.
    slot: false,
  },
  indent: 2,
  innerWrapThreshold: 30,
  outerWrapThreshold: 60,
  isCustomElement: () => false,
};

export function renderSnippet(
  component: ComponentInternalInstance,
  options: Partial<RenderingOptions>
): string {
  const finalOptions = { ...defaultOptions, ...options };

  const target = component.subTree.type;

  const nodes =
    typeof target === 'object' && 'template' in target && typeof target.template === 'string'
      ? parseTemplate(target.template, component, finalOptions)
      : parseVNode(component.subTree, finalOptions);

  return nodes.map((node) => serialize(node, finalOptions)).join('\n');
}

function parseTemplate(
  template: string,
  component: ComponentInternalInstance,
  options: RenderingOptions
): Node[] {
  const ast = baseParse(template);

  if (component.subTree.component) {
    extractPropBinding(ast, component.subTree.component.proxy);
  }

  return astToInternalNodes(ast, options);
}

function parseVNode(vnode: VNode, options: RenderingOptions): Node[] {
  return vnodeToInternalNode(vnode);
}
