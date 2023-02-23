/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
import { addons, useEffect } from '@storybook/preview-api';
import type { ArgTypes, Args, StoryContext, Renderer } from '@storybook/types';

import { SourceType, SNIPPET_RENDERED } from '@storybook/docs-tools';

import type {
  TemplateChildNode,
  ElementNode,
  AttributeNode,
  DirectiveNode,
  TextNode,
  InterpolationNode,
} from '@vue/compiler-core';
import {
  baseParse,
  // ExpressionNode,
  NodeTypes,
} from '@vue/compiler-core';
import { h } from 'vue';

type ArgEntries = [string, any][];
type Attribute = {
  name: string;
  value: string;
  sourceSpan?: any;
  valueSpan?: any;
} & Record<string, any>;
/**
 * Check if the sourcecode should be generated.
 *
 * @param context StoryContext
 */
const skipSourceRender = (context: StoryContext<Renderer>) => {
  const sourceParams = context?.parameters.docs?.source;
  const isArgsStory = context?.parameters.__isArgsStory;

  // always render if the user forces it
  if (sourceParams?.type === SourceType.DYNAMIC) {
    return false;
  }

  // never render if the user is forcing the block to render code, or
  // if the user provides code, or if it's not an args story.
  return !isArgsStory || sourceParams?.code || sourceParams?.type === SourceType.CODE;
};

/**
 * Extract a component name.
 *
 * @param component Component
 */
function getComponentNameAndChildren(component: any): {
  name: string | null;
  children: any;
  attributes: any;
} {
  return {
    name: component?.name || component?.__name || component?.__docgenInfo?.__name || null,
    children: component?.children || null,
    attributes: component?.attributes || component?.attrs || null,
  };
}
/**
 *
 * @param _args
 * @param argTypes
 * @param byRef
 */
function generateAttributesSource(
  args: (AttributeNode | DirectiveNode)[],
  argTypes: ArgTypes,
  byRef?: boolean
): string {
  return Object.keys(args)
    .map((key: any) => args[key].loc.source)
    .join(' ');
}

function generateAttributeSource(
  key: string,
  value: Args[keyof Args],
  argType: ArgTypes[keyof ArgTypes]
): string {
  if (!value) {
    return '';
  }

  if (value === true) {
    return key;
  }

  if (key.startsWith('v-on:')) {
    return `${key}='() => {}'`;
  }

  if (typeof value === 'string') {
    return `${key}='${value}'`;
  }

  return `:${key}='${JSON.stringify(value)}'`;
}

/**
 *
 * @param args generate script setup from args
 * @param argTypes
 */
function generateScriptSetup(args: Args, argTypes: ArgTypes, components: any[]): string {
  const scriptLines = Object.keys(args).map(
    (key: any) =>
      `const ${key} = ${
        typeof args[key] === 'function' ? `()=>{}` : `ref(${JSON.stringify(args[key])});`
      }`
  );
  scriptLines.unshift(`import { ref } from "vue";`);

  return `<script lang='ts' setup>${scriptLines.join('\n')}</script>`;
}
/**
 * get component templates one or more
 * @param renderFn
 */
function getTemplates(renderFn: any): TemplateChildNode[] {
  try {
    const { template } = renderFn();
    const ast = baseParse(template);
    const components = ast?.children;
    if (!components) return [];
    return components;
  } catch (e) {
    // console.error(e);
    console.log(' no template ');
    return [];
  }
}

/**
 * Generate a vue3 template.
 *
 * @param component Component
 * @param args Args
 * @param argTypes ArgTypes
 * @param slotProp Prop used to simulate a slot
 */
export function generateSource(
  componentOrNode: TemplateChildNode[],
  args: Args,
  argTypes: ArgTypes,
  byRef?: boolean | undefined
): string | null {
  const generateComponentSource = (component: TemplateChildNode) => {
    // const { name, children, attributes } = getComponentNameAndChildren(component);

    let attributes;
    let name;
    let children;
    let content;
    if (component.type === 1) {
      const child = component as ElementNode;
      attributes = child.props;
      name = child.tag;
      children = child.children;
    }
    if (component.type === 5) {
      const child = component as InterpolationNode;
      content = child.content;
    }

    if (component.type === 2) {
      const child = component as TextNode;
      content = child.content;
    }

    if (typeof (component as any).render === 'function') {
      // children = child.children;
      const vnode = h(component, args);
      if (vnode.props) {
        const { props } = vnode;
        const attributesNode = mapAttributesAndDirectives(props);

        attributes = attributesNode;
      }
      name = vnode.type.__docgenInfo.displayName;
    }

    let source = '';
    const argsIn = attributes ?? []; // keep only args that are in attributes
    const props = generateAttributesSource(argsIn, argTypes, byRef);
    if (name) source += `<${name} ${props} >`;

    if (children) {
      source += children.map((node: TemplateChildNode) => generateComponentSource(node)).concat('');
    }
    if (content) {
      if (typeof content !== 'string') content = args[content.content.toString().split('.')[1]];
      source += content;
    }
    if (name) source += `</${name}>`;
    return source;
  };

  const source = Object.keys(componentOrNode)
    .map((key: any) => generateComponentSource(componentOrNode[key]))
    .join(' ');

  return source;
}

function mapAttributesAndDirectives(props: Args) {
  const eventDirective = (key: string, value: unknown) =>
    typeof value === 'function'
      ? `${key.replace(/on([A-Z][a-z]+)/g, '@$1').toLowerCase()}='()=>{}'`
      : `${key}='${value}'`;

  const source = (key: string, value: unknown) =>
    ['boolean', 'number', 'object'].includes(typeof value)
      ? `:${key}='${value}'`
      : eventDirective(key, value);

  return Object.keys(props)
    .map((key) => ({
      name: key,
      type: ['v-', '@', 'v-on'].includes(key) ? 7 : 6,
      arg: { content: key, loc: { source: key } },
      loc: { source: source(key, props[key]) },
      exp: { isStatic: false, loc: { source: props[key] } },
      modifiers: [''],
    }))
    .concat();
}

/**
 * create Named Slots content in source
 * @param slotProps
 * @param slotArgs
 */

function createNamedSlots(slotArgs: ArgEntries, slotProps: ArgEntries, byRef?: boolean) {
  if (!slotArgs) return '';
  const many = slotProps.length > 1;
  return slotArgs
    .map(([key, value]) => {
      const content = !byRef ? JSON.stringify(value) : `{{ ${key} }}`;
      return many ? `  <template #${key}>${content}</template>` : `  ${content}`;
    })
    .join('\n');
}

function getArgsInAttrs(args: Args, attributes: Attribute[]) {
  return Object.keys(args).reduce((acc, prop) => {
    if (attributes?.find((attr: any) => attr.name === 'v-bind')) {
      acc[prop] = args[prop];
    }
    const attribute = attributes?.find(
      (attr: any) => attr.name === prop || attr.name === `:${prop}`
    );
    if (attribute) {
      acc[prop] = attribute.name === `:${prop}` ? args[prop] : attribute.value;
    }
    if (Object.keys(acc).length === 0) {
      attributes?.forEach((attr: any) => {
        acc[attr.name] = JSON.parse(JSON.stringify(attr.value));
      });
    }
    return acc;
  }, {} as Record<string, any>);
}

/**
 * format prettier for vue
 * @param source
 */

/**
 *  source decorator.
 * @param storyFn Fn
 * @param context  StoryContext
 */
export const sourceDecorator = (storyFn: any, context: StoryContext<Renderer>) => {
  const channel = addons.getChannel();
  const skip = skipSourceRender(context);
  const story = storyFn();

  let source: string;

  useEffect(() => {
    if (!skip && source) {
      const { id, args } = context;
      channel.emit(SNIPPET_RENDERED, { id, args, source, format: 'vue' });
    }
  });

  if (skip) {
    return story;
  }

  const { args = {}, component: ctxtComponent, argTypes = {} } = context || {};

  const components = getTemplates(context?.originalStoryFn);

  const storyComponent = components.length ? components : [ctxtComponent as TemplateChildNode];

  const withScript = context?.parameters?.docs?.source?.withScriptSetup || false;
  const generatedScript = withScript ? generateScriptSetup(args, argTypes, components) : '';
  const generatedTemplate = generateSource(storyComponent, args, argTypes, withScript);
  console.log(' generatedTemplate ', generatedTemplate);

  if (generatedTemplate) {
    source = `${generatedScript}\n <template>\n ${generatedTemplate} \n</template>`;
  }

  return story;
};
