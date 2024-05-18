/* eslint-disable no-underscore-dangle */
import { addons } from '@storybook/core/dist/preview-api';
import type { ArgTypes, Args, StoryContext } from '@storybook/core/dist/types';

import { SourceType, SNIPPET_RENDERED } from '@storybook/core/dist/docs-tools';

import type {
  ElementNode,
  AttributeNode,
  DirectiveNode,
  TextNode,
  InterpolationNode,
  TemplateChildNode,
} from '@vue/compiler-core';
import { baseParse } from '@vue/compiler-core';
import type { ConcreteComponent, FunctionalComponent, VNode } from 'vue';
import { h, isVNode, watch } from 'vue';
import kebabCase from 'lodash/kebabCase';
import {
  attributeSource,
  htmlEventAttributeToVueEventAttribute,
  omitEvent,
  evalExp,
  replaceValueWithRef,
  generateExpression,
} from './utils';
import type { VueRenderer } from '../types';

/**
 * Check if the sourcecode should be generated.
 *
 * @param context StoryContext
 */
const skipSourceRender = (context: StoryContext<VueRenderer>) => {
  const sourceParams = context?.parameters.docs?.source;
  const isArgsStory = context?.parameters.__isArgsStory;
  const isDocsViewMode = context?.viewMode === 'docs';

  // always render if the user forces it
  if (sourceParams?.type === SourceType.DYNAMIC) {
    return false;
  }

  // never render if the user is forcing the block to render code, or
  // if the user provides code, or if it's not an args story.
  return (
    !isDocsViewMode || !isArgsStory || sourceParams?.code || sourceParams?.type === SourceType.CODE
  );
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
      const source = tempArgs[key].loc.source.replace(/\$props/g, 'args');
      const argKey = (tempArgs[key] as DirectiveNode).arg?.loc.source;
      return byRef && argKey
        ? replaceValueWithRef(source, args, argKey)
        : evalExp(source, omitEvent(args));
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
      }) as unknown as AttributeNode
  );
}
/**
 *  map slots
 * @param slotsArgs
 */
function mapSlots(
  slotsArgs: Args,
  generateComponentSource: any,
  slots: { name: string; scoped?: boolean; bindings?: { name: string }[] }[]
): TextNode[] {
  return Object.keys(slotsArgs).map((key) => {
    const slot = slotsArgs[key];
    let slotContent = '';

    const scropedArgs = slots
      .find((s) => s.name === key && s.scoped)
      ?.bindings?.map((b) => b.name)
      .join(',');

    if (typeof slot === 'string') {
      slotContent = slot;
    } else if (typeof slot === 'function') {
      slotContent = generateExpression(slot);
    } else if (isVNode(slot)) {
      slotContent = generateComponentSource(slot);
    } else if (typeof slot === 'object' && !isVNode(slot)) {
      slotContent = JSON.stringify(slot);
    }

    const bindingsString = scropedArgs ? `="{${scropedArgs}}"` : '';
    slotContent = slot ? `<template #${key}${bindingsString}>${slotContent}</template>` : ``;

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
  context?: StoryContext<VueRenderer>
): (TemplateChildNode | VNode)[] {
  try {
    const originalStoryFn = renderFn;

    const storyFn = originalStoryFn ? originalStoryFn(context?.args, context) : context?.component;
    const story = typeof storyFn === 'function' ? storyFn() : storyFn;

    const { template } = story;

    if (!template) return [h(story, context?.args)];
    return getComponents(template);
  } catch (e) {
    return [];
  }
}

function getComponents(template: string): (TemplateChildNode | VNode)[] {
  const ast = baseParse(template, {
    isNativeTag: () => true,
    decodeEntities: (rawtext, asAttr) => rawtext,
  });
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
  componentOrNodes: (ConcreteComponent | TemplateChildNode)[] | TemplateChildNode | VNode,
  { args, argTypes }: { args: Args; argTypes: ArgTypes },
  byRef = false
) {
  const isElementNode = (node: any) => node && node.type === 1;
  const isInterpolationNode = (node: any) => node && node.type === 5;
  const isTextNode = (node: any) => node && node.type === 2;

  const generateComponentSource = (
    componentOrNode: ConcreteComponent | TemplateChildNode | VNode
  ) => {
    if (isElementNode(componentOrNode)) {
      const { tag: name, props: attributes, children } = componentOrNode as ElementNode;
      const childSources: string =
        typeof children === 'string'
          ? children
          : children.map((child: TemplateChildNode) => generateComponentSource(child)).join('');
      const props = generateAttributesSource(attributes, args, argTypes, byRef);

      return childSources === ''
        ? `<${name} ${props} />`
        : `<${name} ${props}>${childSources}</${name}>`;
    }

    if (isTextNode(componentOrNode)) {
      const { content } = componentOrNode as TextNode;
      return content;
    }
    if (isInterpolationNode(componentOrNode)) {
      const { content } = componentOrNode as InterpolationNode;
      const expValue = evalExp(content.loc.source, args);
      if (expValue === content.loc.source) return `{{${expValue}}}`;
      return eval(expValue);
    }
    if (isVNode(componentOrNode)) {
      const vnode = componentOrNode as VNode;
      const { props, type, children } = vnode;
      const slotsProps = typeof children === 'string' ? undefined : (children as Args);
      const componentSlots = (type as any)?.__docgenInfo?.slots;

      const attrsProps = slotsProps
        ? Object.fromEntries(
            Object.entries(props ?? {})
              .filter(([key, value]) => !slotsProps[key] && !['class', 'style'].includes(key))
              .map(([key, value]) => [key, value])
          )
        : props;
      const attributes = mapAttributesAndDirectives(attrsProps ?? {});
      const slotArgs = Object.fromEntries(
        Object.entries(props ?? {}).filter(([key, value]) => slotsProps?.[key])
      );

      const childSources: string = children
        ? typeof children === 'string'
          ? children
          : mapSlots(slotArgs as Args, generateComponentSource, componentSlots ?? [])
              .map((child) => child.content)
              .join('')
        : '';
      const name =
        typeof type === 'string'
          ? type
          : (type as FunctionalComponent).name ||
            (type as ConcreteComponent).__name ||
            (type as any).__docgenInfo?.displayName;
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
export const sourceDecorator = (storyFn: any, context: StoryContext<VueRenderer>) => {
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

export function generateSource(context: StoryContext<VueRenderer>) {
  const channel = addons.getChannel();
  const { args = {}, argTypes = {}, id } = context || {};
  const storyComponents = getTemplateComponents(context?.originalStoryFn, context);

  const withScript = context?.parameters?.docs?.source?.withScriptSetup || false;
  const generatedScript = withScript ? generateScriptSetup(args, argTypes, storyComponents) : '';
  const generatedTemplate = generateTemplateSource(storyComponents, context, withScript);

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
