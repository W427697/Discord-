/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
import { addons, useEffect } from '@storybook/preview-api';
import type { ArgTypes, Args, StoryContext, Renderer } from '@storybook/types';

import { SourceType, SNIPPET_RENDERED } from '@storybook/docs-tools';

import type {
  ElementNode,
  AttributeNode,
  DirectiveNode,
  TextNode,
  InterpolationNode,
  TemplateChildNode,
} from '@vue/compiler-core';
import { baseParse } from '@vue/compiler-core';
import type { Component } from 'vue';
import { h } from 'vue';
import { kebabCase } from 'lodash';

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

const directiveSource = (key: string, value: unknown) =>
  typeof value === 'function'
    ? `${key.replace(/on([A-Z][a-z]+)/g, '@$1').toLowerCase()}='()=>{}'`
    : `${key}='${value}'`;

const attributeSource = (key: string, value: unknown) =>
  ['boolean', 'number', 'object'].includes(typeof value)
    ? `:${key}='${JSON.stringify(value)}'`
    : directiveSource(key, value);
/**
 *
 * @param _args
 * @param argTypes
 * @param byRef
 */
export function generateAttributesSource(
  tempArgs: (AttributeNode | DirectiveNode)[],
  args: Args,
  argTypes: ArgTypes,
  byRef?: boolean
): string {
  return Object.keys(tempArgs)
    .map((key: any) => {
      const arg = tempArgs[key];
      if (arg.type === 7) {
        const { exp, arg: argName } = arg;
        const argKey = argName?.content;
        const argExpValue = exp?.content;
        const argValue = argKey ? args[argKey] : JSON.stringify(args);
        return argKey
          ? attributeSource(argKey, argValue)
          : tempArgs[key].loc.source.replace(`"${argExpValue}"`, `'${argValue}'`);
      }
      return tempArgs[key].loc.source;
    })
    .join(' ');
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
function getComponentsFromRenderFn(renderFn: any): TemplateChildNode[] {
  const { template } = renderFn();
  if (!template) return [];
  return getComponentsFromTemplate(template);
}

export function getComponentsFromTemplate(template: string): TemplateChildNode[] {
  try {
    const ast = baseParse(template);
    const components = ast?.children;
    if (!components) return [];
    return components;
  } catch (e) {
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
  componentOrNode: (TemplateChildNode | (Component & { type?: number }))[],
  args: Args,
  argTypes: ArgTypes,
  byRef?: boolean | undefined
): string | null {
  const generateComponentSource = (
    component: TemplateChildNode | (Component & { type?: number })
  ) => {
    let attributes;
    let name;
    let children;
    let content;
    if (component) {
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
    }
    const concreteComponent = component as Component & { render: any };
    if (typeof concreteComponent.render === 'function') {
      const vnode = h(component, args);
      if (vnode.props) {
        const { props } = vnode;
        attributes = mapAttributesAndDirectives(props);
      }
      name =
        vnode.type || concreteComponent.tag || concreteComponent.name || concreteComponent.__name;
    }

    let source = '';
    const templateAttrs = attributes ?? []; // keep only args that are in attributes
    const props = generateAttributesSource(templateAttrs, args, argTypes, byRef);
    if (name) source += `<${name} ${props} >`;

    if (children) {
      source += children.map((node: TemplateChildNode) => generateComponentSource(node)).join(' ');
    }
    if (content) {
      if (typeof content !== 'string') content = args[content.content.toString().split('.')[1]];
      source += content;
    }
    if (name) source += `</${name}>`;
    return source;
  };

  if (Array.isArray(componentOrNode)) {
    return componentOrNode.map((node) => generateComponentSource(node)).join(' ');
  }

  return null;
}

export function mapAttributesAndDirectives(props: Args) {
  return Object.keys(props).map(
    (key) =>
      ({
        name: 'bind',
        type: ['v-', '@', 'v-on'].includes(key) ? 7 : 6, // 6 is attribute, 7 is directive
        arg: { content: kebabCase(key), loc: { source: kebabCase(key) } }, // attribute name or directive name (v-bind, v-on, v-model)
        loc: { source: attributeSource(kebabCase(key), props[key]) }, // attribute value or directive value
        exp: { isStatic: false, loc: { source: props[key] } }, // directive expression
        modifiers: [''],
      } as unknown as AttributeNode)
  );
}
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

  const components = getComponentsFromRenderFn(context?.originalStoryFn);

  console.log(' components ', components);

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
