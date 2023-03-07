/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
import { addons } from '@storybook/preview-api';
import type { ArgTypes, Args, StoryContext, Renderer } from '@storybook/types';

import { getDocgenSection, SourceType, SNIPPET_RENDERED } from '@storybook/docs-tools';

import type {
  ElementNode,
  AttributeNode,
  DirectiveNode,
  TextNode,
  InterpolationNode,
  TemplateChildNode,
} from '@vue/compiler-core';
import { baseParse } from '@vue/compiler-core';
import { h, watch } from 'vue';
import { camelCase, kebabCase } from 'lodash';
import {
  attributeSource,
  htmlEventAttributeToVueEventAttribute,
  omitEvent,
  displayObject,
  evalExp,
} from './utils';
import type { VueStoryComponent } from '../types';

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
        // AttributeNode binding type
        const { exp, arg: argName } = arg;
        const argKey = argName ? argName?.loc.source : undefined;
        const argExpValue = exp?.loc.source ?? (exp as any).content;
        const propValue = args[camelCase(argKey)];
        const argValue = argKey
          ? propValue ?? evalExp(argExpValue, args)
          : displayObject(omitEvent(args));

        return argKey ? attributeSource(argKey, argValue, true) : `v-bind="${argValue}"`;
      }

      return tempArgs[key].loc.source;
    })
    .join(' ');
}
/**
 * map attributes and directives
 * @param props
 */
function mapAttributesAndDirectives(props: Args) {
  const tranformKey = (key: string) => (key.startsWith('on') ? key : kebabCase(key));
  return Object.keys(props).map(
    (key) =>
      ({
        name: 'bind',
        type: ['v-', '@', 'v-on'].includes(key) ? 7 : 6, // 6 is attribute, 7 is directive
        arg: { content: tranformKey(key), loc: { source: tranformKey(key) } }, // attribute name or directive name (v-bind, v-on, v-model)
        loc: { source: attributeSource(tranformKey(key), props[key]) }, // attribute value or directive value
        exp: { isStatic: false, loc: { source: props[key] } }, // directive expression
        modifiers: [''],
      } as unknown as AttributeNode)
  );
}
/**
 *  map slots
 * @param slotsProps
 */
function mapSlots(slotsProps: Args): TextNode[] {
  return Object.keys(slotsProps).map((key) => {
    const slot = slotsProps[key];
    let slotContent = '';
    if (typeof slot === 'function') slotContent = `<template #${key}>${slot()}</template>`;
    slotContent = `<template #${key}>${JSON.stringify(slot)}</template>`;
    if (key === 'default') {
      slotContent = JSON.stringify(slot);
    }

    return {
      type: 2,
      content: slotContent,
      loc: {
        source: slotContent,
        start: { offset: 0, line: 1, column: 0 },
        end: { offset: 0, line: 1, column: 0 },
      },
    };
  });
  // TODO: handle other cases (array, object, html,etc)
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
 * get template components one or more
 * @param renderFn
 */
function getTemplateComponents(
  renderFn: any,
  context?: StoryContext<Renderer>
): TemplateChildNode[] {
  try {
    const { template } = context ? renderFn(context.args, context) : renderFn();
    if (!template) return [];
    return getComponents(template);
  } catch (e) {
    return [];
  }
}

function getComponents(template: string): TemplateChildNode[] {
  const ast = baseParse(template);
  const components = ast?.children;
  if (!components) return [];
  return components;
}

/**
 * Generate a vue3 template.
 *
 * @param component Component
 * @param args Args
 * @param argTypes ArgTypes
 * @param slotProp Prop used to simulate a slot
 */

export function generateTemplateSource(
  componentOrNodes: (VueStoryComponent | TemplateChildNode)[] | TemplateChildNode,
  args: Args,
  argTypes: ArgTypes,
  byRef = false
) {
  const isComponent = (component: any) => component && typeof component.render === 'function';
  const isElementNode = (node: any) => node && node.type === 1;
  const isInterpolationNode = (node: any) => node && node.type === 5;
  const isTextNode = (node: any) => node && node.type === 2;

  const generateComponentSource = (componentOrNode: VueStoryComponent | TemplateChildNode) => {
    if (isElementNode(componentOrNode)) {
      const { tag: name, props: attributes, children } = componentOrNode as ElementNode;
      const childSources: string = children
        .map((child: TemplateChildNode) => generateComponentSource(child))
        .join('');
      const props = generateAttributesSource(attributes, args, argTypes, byRef);

      return childSources === ''
        ? `<${name} ${props} />`
        : `<${name} ${props}>${childSources}</${name}>`;
    }

    if (isInterpolationNode(componentOrNode) || isTextNode(componentOrNode)) {
      const { content } = componentOrNode as InterpolationNode | TextNode;
      // eslint-disable-next-line no-eval
      if (typeof content !== 'string') return eval(content.loc.source); // it's a binding safe to eval
      return content;
    }

    if (isComponent(componentOrNode)) {
      const concreteComponent = componentOrNode as VueStoryComponent;
      const vnode = h(componentOrNode, args);
      const { props } = vnode;
      const { slots } = getDocgenSection(concreteComponent, 'slots') || {};
      const slotsProps = {} as Args;
      const attrsProps = { ...props };
      if (slots && props)
        Object.keys(props).forEach((prop: any) => {
          const isSlot = slots.find(({ name: slotName }: { name: string }) => slotName === prop);
          if (isSlot?.name) {
            slotsProps[prop] = props[prop];
            delete attrsProps[prop];
          }
        });
      const attributes = mapAttributesAndDirectives(attrsProps);
      const childSources: string = mapSlots(slotsProps)
        .map((child) => generateComponentSource(child))
        .join('');
      const name = concreteComponent.tag || concreteComponent.name || concreteComponent.__name;
      const propsSource = generateAttributesSource(attributes, args, argTypes, byRef);
      return childSources.trim() === ''
        ? `<${name} ${propsSource}/>`
        : `<${name} ${propsSource}>${childSources}</${name}>`;
    }
    return null;
  };

  const componentsOrNodes = Array.isArray(componentOrNodes) ? componentOrNodes : [componentOrNodes];
  const source = componentsOrNodes
    .map((componentOrNode) => generateComponentSource(componentOrNode))
    .join(' ');
  return source || null;
}

/**
 *  source decorator.
 * @param storyFn Fn
 * @param context  StoryContext
 */
export const sourceDecorator = (storyFn: any, context: StoryContext<Renderer>) => {
  const skip = skipSourceRender(context);
  const story = storyFn();
  watch(
    () => context.args,
    () => {
      if (!skip) {
        generateSource(context);
      }
    },
    { immediate: true, deep: true }
  );
  return story;
};

export function generateSource(context: StoryContext<Renderer>) {
  const channel = addons.getChannel();
  const { args = {}, component: ctxtComponent, argTypes = {}, id } = context || {};
  const components = getTemplateComponents(context?.originalStoryFn, context);
  const storyComponent = components.length ? components : (ctxtComponent as TemplateChildNode);

  const withScript = context?.parameters?.docs?.source?.withScriptSetup || false;
  const generatedScript = withScript ? generateScriptSetup(args, argTypes, components) : '';
  const generatedTemplate = generateTemplateSource(storyComponent, context.args, context.argTypes);
  if (generatedTemplate) {
    const source = `${generatedScript}\n <template>\n ${generatedTemplate} \n</template>`;
    channel.emit(SNIPPET_RENDERED, { id, args, source, format: 'vue' });
    return source;
  }
  return null;
}
// export local function for testing purpose
export {
  generateScriptSetup,
  getTemplateComponents as getComponentsFromRenderFn,
  getComponents as getComponentsFromTemplate,
  mapAttributesAndDirectives,
  attributeSource,
  htmlEventAttributeToVueEventAttribute,
};
