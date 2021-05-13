import React, { FunctionComponent, ReactNode, ElementType, ComponentProps, useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { resetComponents, Story as PureStory } from '@storybook/components';
import { DOCS_TARGETTED_RENDER, DOCS_TARGETTED_DESTROY } from '@storybook/core-events';
import { toId, storyNameFromExport } from '@storybook/csf';
import { Args, BaseAnnotations } from '@storybook/addons';
import { CURRENT_SELECTION } from './types';

import { DocsContext, DocsContextProps } from './DocsContext';

export const storyBlockIdFromId = (storyId: string) => `story--${storyId}`;

// type PureStoryProps = ComponentProps<typeof PureStory>;

type CommonProps = BaseAnnotations<Args, any> & {
  height?: string;
  inline?: boolean;
};

type StoryDefProps = {
  name: string;
  children: ReactNode;
};

type StoryRefProps = {
  id?: string;
};

type StoryImportProps = {
  name: string;
  story: ElementType;
};

export type StoryProps = (StoryDefProps | StoryRefProps | StoryImportProps) & CommonProps;

export const lookupStoryId = (
  storyName: string,
  { mdxStoryNameToKey, mdxComponentMeta }: DocsContextProps
) =>
  toId(
    mdxComponentMeta.id || mdxComponentMeta.title,
    storyNameFromExport(mdxStoryNameToKey[storyName])
  );

// export const getStoryProps = (props: StoryProps, context: DocsContextProps): PureStoryProps => {
//   const { id } = props as StoryRefProps;
//   const { name } = props as StoryDefProps;
//   const inputId = id === CURRENT_SELECTION ? context.id : id;
//   const previewId = inputId || lookupStoryId(name, context);
//   const data = context.storyStore.fromId(previewId) || {};

//   const { height, inline } = props;
//   const { storyFn = undefined, name: storyName = undefined, parameters = {} } = data;
//   const { docs = {} } = parameters;

//   if (docs.disable) {
//     return null;
//   }

//   // prefer block props, then story parameters defined by the framework-specific settings and optionally overridden by users
//   const { inlineStories = false, iframeHeight = 100, prepareForInline } = docs;
//   const storyIsInline = typeof inline === 'boolean' ? inline : inlineStories;

//   if (storyIsInline && !prepareForInline) {
//     throw new Error(
//       `Story '${storyName}' is set to render inline, but no 'prepareForInline' function is implemented in your docs configuration!`
//     );
//   }

//   return {
//     parameters,
//     inline: storyIsInline,
//     id: previewId,
//     storyFn: prepareForInline && storyFn ? () => prepareForInline(storyFn, data) : storyFn,
//     height: height || (storyIsInline ? undefined : iframeHeight),
//     title: storyName,
//   };
// };

const Placeholder: FunctionComponent<any> = ({ id, name, channel }) => {
  const identifier = storyBlockIdFromId(id);
  useEffect(() => {
    channel.emit(DOCS_TARGETTED_RENDER, { identifier, id, name });
    return () => {
      channel.emit(DOCS_TARGETTED_DESTROY, { identifier, id, name });
      console.log(`emit ${DOCS_TARGETTED_DESTROY}`);
    };
  });

  return (
    <div id={identifier} data-name={name}>
      loading story...
    </div>
  );
};

const Story: FunctionComponent<StoryProps> = (props) => (
  <DocsContext.Consumer>
    {(context) => {
      const { id } = props as StoryRefProps;
      const { name } = props as StoryDefProps;
      const inputId = id === CURRENT_SELECTION ? context.id : id;
      const previewId = inputId || lookupStoryId(name, context);
      console.log({ context, props });

      return (
        <MDXProvider components={resetComponents}>
          <Placeholder id={previewId} name={name} channel={context.channel} />
        </MDXProvider>
      );
    }}
  </DocsContext.Consumer>
);

Story.defaultProps = {
  children: null,
  name: null,
};

export { Story };
