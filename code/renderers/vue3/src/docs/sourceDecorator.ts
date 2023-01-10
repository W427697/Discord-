/* eslint-disable no-underscore-dangle */
import { addons, useEffect } from '@storybook/preview-api';
import type { ArgTypes, Args, StoryContext, Renderer } from '@storybook/types';

import { SourceType, SNIPPET_RENDERED } from '@storybook/docs-tools';

import { format } from 'prettier';
import parserTypescript from 'prettier/parser-typescript';
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
function getComponentNameAndChildren(component: any): { name: string | null; children: any } {
  return {
    name: component?.name || component?.__name || component?.__docgenInfo?.__name || null,
    children: component?.children || null,
  };
}
/**
 * Transform args to props string
 * @param args
 * @param argTypes
 * @param slotProp prop used to simulate slot
 */
function argsToSource(
  args: Args,
  argTypes: ArgTypes,
  slotProps?: string[],
  byRef?: boolean
): string {
  const argsKeys = Object.keys(args).filter(
    (key: any) => !isArray(args[key]) && typeof args[key] !== 'object' && !slotProps?.includes(key)
  );
  const source = argsKeys
    .map((key) =>
      propToDynamicSource(byRef ? `:${key}` : key, byRef ? key : args[key], argTypes, slotProps)
    )
    .filter((item) => item !== '')
    .join(' ');

  return source;
}

function propToDynamicSource(
  key: string,
  value: any,
  argTypes: ArgTypes,
  slotProps?: string[]
): string {
  // slot Args or default value
  // default value ?
  if (
    !value ||
    (slotProps && slotProps.indexOf(key) > -1) ||
    (argTypes[key] && argTypes[key].defaultValue === value)
  ) {
    return '';
  }

  if (value === true) {
    return key;
  }

  if (typeof value === 'string') {
    return `${key}='${value}'`;
  }

  if (typeof value === 'function') {
    return `:${key}='()=>{}'`;
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
      `const ${key} = ${typeof args[key] === 'function' ? `()=>{}` : `ref(${JSON.stringify(args[key])})`
      }`
  );
  scriptLines.unshift(`import { ref } from "vue"`);

  return `<script setup>${scriptLines.join('\n')}</script>`;
}
/**
 * get component templates one or more
 * @param renderFn
 */
function getTemplates(renderFn: any): [] {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const ast = parserHTML.parsers.vue.parse(renderFn.toString());
    let components = ast.children?.filter(
      ({ name: _name = '', type: _type = '' }) =>
        _name && !['template', 'script', 'style', 'slot'].includes(_name) && _type === 'element'
    );
    if (!isArray(components)) {
      return [];
    }
    components = components.map(
      ({ attrs: attributes = [], name: Name = '', children: Children = [] }) => {
        return {
          name: Name,
          attrs: attributes?.filter((el: any) => el.name !== 'v-bind'),
          children: Children,
        };
      }
    );
    return components;
  } catch (e) {
    console.error(e);
  }
  return [];
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
  slotProps?: string[],
  byRef?: boolean | undefined
): string | null {
  if (!compOrComps) return null;
  const generateComponentSource = (component: any): string | null => {
    const { name, children } = getComponentNameAndChildren(component);

    if (!name) {
      return '';
    }

    const props = argsToSource(args, argTypes, slotProps, byRef);
    const slotArgs = Object.fromEntries(
      Object.entries(args).filter(([key, value]) => slotProps && slotProps.indexOf(key) > -1)
    );

    if (slotArgs && Object.keys(slotArgs).length > 0) {
      const namedSlotContents = createNamedSlots(slotProps, slotArgs, byRef);
      return `<${name} ${props}>\n${namedSlotContents}\n</${name}>`;
    }

    if (children && children.length > 0) {
      const childrenSource = children.map((child: any) => {
        return generateSource(
          typeof child.value === 'string' ? getTemplates(child.value) : child.value,
          args,
          argTypes,
          slotProps,
          byRef
        );
      });

      if (childrenSource.join('').trim() === '') return `<${name} ${props}/>`;

      const isNativeTag =
        name.includes('template') ||
        name.match(/^[a-z]/) ||
        (name === 'Fragment' && !name.includes('-'));

      return `<${name} ${isNativeTag ? '' : props}>\n${childrenSource}\n</${name}>`;
    }

    return `<${name} ${props}/>`;
  };
  // get one component or multiple
  const components = isArray(compOrComps) ? compOrComps : [compOrComps];

  const source = Object.keys(components)
    .map((key: any) => `${generateComponentSource(components[key])}`)
    .join(`\n`);
  return source;
}

/**
 * create Named Slots content in source
 * @param slotProps
 * @param slotArgs
 */

function createNamedSlots(
  slotProps: string[] | null | undefined,
  slotArgs: Args,
  byRef?: boolean | undefined
) {
  if (!slotProps) return '';
  if (slotProps.length === 1) return !byRef ? slotArgs[slotProps[0]] : ` {{ ${slotProps[0]} }}`;

  return Object.entries(slotArgs)
    .map(([key, value]) => {
      return `  <template #${key}>
    ${!byRef ? JSON.stringify(value) : `{{ ${key} }}`}
  </template>`;
    })
    .join('\n');
}
/**
 * format prettier for vue
 * @param source
 */

function prettierFormat(source: string): string {
  try {
    return format(source, {
      vueIndentScriptAndStyle: true,
      parser: 'vue',
      plugins: [parserHTML, parserTypescript],
      singleQuote: true,
      quoteProps: 'preserve',
    });
  } catch (e: any) {
    console.error(e.toString());
  }
  return source;
}
/**
 * get slots from vue component
 * @param ctxtComponent Vue Component
 */

function getComponentSlots(ctxtComponent: any): string[] {
  if (!ctxtComponent) return [];
  return ctxtComponent?.__docgenInfo?.slots?.map((slot: { name: string }) => slot.name) || [];
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

  const { args = {}, component: ctxtComponent, argTypes = {} } = context || {};
  const components = getTemplates(context?.originalStoryFn);

  const storyComponent = components.length ? components : ctxtComponent;

  const slotProps: string[] = getComponentSlots(ctxtComponent);
  const withScript = context?.parameters?.docs?.source?.withScriptSetup || false;
  const generatedScript = withScript ? generateScriptSetup(args, argTypes, components) : '';
  const generatedTemplate = generateSource(storyComponent, args, argTypes, slotProps, withScript);

  if (generatedTemplate) {
    source = prettierFormat(`${generatedScript}\n <template>\n ${generatedTemplate} \n</template>`);
  }

  return story;
};
