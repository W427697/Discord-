/* eslint-disable no-underscore-dangle */
import { addons, useEffect } from '@storybook/preview-api';
import type { ArgTypes, Args, StoryContext, Renderer } from '@storybook/types';

import { SourceType, SNIPPET_RENDERED } from '@storybook/docs-tools';

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
function getComponentName(component: any): string | null {
  if (component == null) {
    return null;
  }
  return component.name || component.__name || component.__docgenInfo?.__name;
}

function argsToSource(args: any): string {
  const argsKeys = Object.keys(args);
  const srouce = argsKeys
    .map((key) => propToDynamicSource(key, args[key]))
    .filter((item) => item !== '')
    .join(' ');

  return srouce;
}

function propToDynamicSource(key: string, val: string | boolean | object) {
  if (key.startsWith('slotArgs.')) return '';
  return `:${key}="${key}"`;
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
  component: any,
  args: Args,
  argTypes: ArgTypes,
  slotProp?: string | null
): string | null {
  const name = getComponentName(component);

  if (!name) {
    return null;
  }

  const props = argsToSource(args);

  const slotValue = slotProp ? args[slotProp] : null;

  if (slotValue) {
    return `<${name} ${props}>\n    ${slotValue}\n</${name}>`;
  }

  return `<${name} ${props}/>`;
}

/**
 * Svelte source decorator.
 * @param storyFn Fn
 * @param context  StoryContext
 */
export const sourceDecorator = (storyFn: any, context: StoryContext<Renderer>) => {
  const channel = addons.getChannel();
  const skip = skipSourceRender(context);
  const story = storyFn();

  let source: string;
  console.log('sourceDecorator ()storyFn', storyFn, 'context ', context);
  useEffect(() => {
    if (!skip && source) {
      channel.emit(SNIPPET_RENDERED, (context || {}).id, source);
    }
  });

  if (skip) {
    return story;
  }

  const { parameters = {}, args = {}, component: ctxtComponent } = context || {};
  const { Component: component = {} } = story;

  const slotProp = null;

  const generated = generateSource(component, args, context?.argTypes, slotProp);
  if (generated) {
    source = generated;
  }
  console.log(' source generated ', generated);

  return story;
};
