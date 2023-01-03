/* eslint-disable no-underscore-dangle */
import { addons, useEffect } from '@storybook/preview-api';
import type { ArgTypes, Args, StoryContext, Renderer } from '@storybook/types';

import { SourceType, SNIPPET_RENDERED } from '@storybook/docs-tools';

import { format } from 'prettier';
// eslint-disable-next-line import/extensions
import parserTypescript from 'prettier/parser-typescript.js';
// eslint-disable-next-line import/extensions
import parserHTML from 'prettier/parser-html.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isArray } from '@vue/shared';

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
  return component?.name || component?.__name || component.__docgenInfo?.__name;
}
/**
 * Transform args to props string
 * @param args
 * @param argTypes
 * @param slotProp prop used to simulate slot
 */
function argsToSource(args: any, argTypes: ArgTypes, slotProps?: string[] | null): string {
  const argsKeys = Object.keys(args);
  const srouce = argsKeys
    .map((key) => propToDynamicSource(key, args[key], argTypes, slotProps))
    .filter((item) => item !== '')
    .join(' ');

  return srouce;
}

function propToDynamicSource(
  key: string,
  val: string | boolean | object,
  argTypes: ArgTypes,
  slotProps?: string[] | null
): string {
  // slot Args or default value
  if (
    (slotProps && slotProps.indexOf(key) > -1) ||
    (argTypes[key] && argTypes[key].defaultValue === val)
  )
    return '';
  return `:${key}="${key}"`;
}

function generateSetupScript(args: any, argTypes: ArgTypes): string {
  const argsKeys = args ? Object.keys(args) : [];
  let scriptBody = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const key of argsKeys) {
    if (!(argTypes[key] && argTypes[key].defaultValue === args[key]))
      if (typeof args[key] !== 'function')
        scriptBody += `\n const ${key} = ref(${propValueToSource(args[key])})`;
      else scriptBody += `\n const ${key} = ()=>{}`;
  }
  return `<script lang="ts" setup>${scriptBody}\n</script>`;
}

function propValueToSource(val: string | boolean | object | undefined) {
  const type = typeof val;
  switch (type) {
    case 'boolean':
      return val;
    case 'object':
      return `${JSON.stringify(val as object)}`;
    case 'undefined':
      return `${val}`;
    default:
      return `"${val}"`;
  }
}

function getTemplates(renderFunc: any): [] {
  const ast = parserHTML.parsers.vue.parse(
    renderFunc.toString(),
    { vue: parserHTML.parsers.vue },
    {
      locStart(node: any): number {
        throw new Error('Function not implemented.');
      },
      locEnd(node: any): number {
        throw new Error('Function not implemented.');
      },
      originalText: '',
      semi: false,
      singleQuote: false,
      jsxSingleQuote: false,
      trailingComma: 'none',
      bracketSpacing: false,
      bracketSameLine: false,
      jsxBracketSameLine: false,
      rangeStart: 0,
      rangeEnd: 0,
      parser: 'vue',
      filepath: '',
      requirePragma: false,
      insertPragma: false,
      proseWrap: 'always',
      arrowParens: 'always',
      plugins: [],
      pluginSearchDirs: false,
      htmlWhitespaceSensitivity: 'css',
      endOfLine: 'auto',
      quoteProps: 'preserve',
      vueIndentScriptAndStyle: false,
      embeddedLanguageFormatting: 'auto',
      singleAttributePerLine: false,
      printWidth: 0,
      tabWidth: 0,
      useTabs: false,
    }
  );

  let components = ast.children?.filter((element: any) => element.name);
  components = components.map((element: any) => {
    const { attrs: att = [] } = element;
    const att3 = att?.filter((el: any) => el.name !== 'v-bind'); //  as Array<any>).push(props);
    return { name: element.name, attrs: att3 };
  });
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
export function generateSource(
  compOrComps: any,
  args: Args,
  argTypes: ArgTypes,
  slotProps?: string[] | null
): string | null {
  const generateComponentSource = (component: any): string | null => {
    const name = getComponentName(component);

    if (!name) {
      return null;
    }

    const props = argsToSource(args, argTypes, slotProps);

    const slotValues = slotProps?.map((slotProp) => args[slotProp]); // slotProp ? args[slotProp] : null;

    if (slotValues) {
      const namedSlotContents = createNamedSlots(slotProps, slotValues);
      return `<${name} ${props}>\n  ${namedSlotContents}  \n</${name}>`;
    }

    return `<${name} ${props}/>`;
  };
  // handle one component or multiple
  const components = isArray(compOrComps) ? compOrComps : [compOrComps];
  let source = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const comp of components) {
    source += `${generateComponentSource(comp)}\n`;
  }

  return source;
}
/**
 * create Named Slots content in source
 * @param slotProps
 * @param slotValues
 */

function createNamedSlots(
  slotProps: string[] | null | undefined,
  slotValues: { [key: string]: any }
) {
  if (!slotProps) return '';
  let template = '';
  if (slotProps.length === 1 && slotProps[0] === 'default') return `{{ default }}`;
  // eslint-disable-next-line no-restricted-syntax
  for (const slotProp of slotProps) {
    if (slotValues[slotProps.indexOf(slotProp)])
      template += `<template #${slotProp}> {{ ${slotProp} }}</template>`;
  }
  return template;
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
      channel.emit(SNIPPET_RENDERED, (context || {}).id, source);
    }
  });

  if (skip) {
    return story;
  }

  const { args = {}, component: ctxtComponent, originalStoryFn: render } = context || {};
  const components = getTemplates(render);

  const renderedComponent = components.length ? components : ctxtComponent;

  const cWrap: any = ctxtComponent;

  const slotProps: string[] = cWrap.__docgenInfo?.slots?.map((slot: { name: string }) => slot.name);

  const generatedTemplate = generateSource(renderedComponent, args, context?.argTypes, slotProps);
  const generatedScript = generateSetupScript(args, context?.argTypes);

  if (generatedTemplate) {
    source = format(`${generatedScript}\n<template>\n ${generatedTemplate} \n</template>`, {
      vueIndentScriptAndStyle: true,
      parser: 'vue',
      plugins: [parserHTML, parserTypescript],
    });
  }

  return story;
};
