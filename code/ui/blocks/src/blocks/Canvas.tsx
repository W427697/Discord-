/* eslint-disable react/destructuring-assignment */
import React, { Children, useContext } from 'react';
import type { FC, ReactElement, ReactNode } from 'react';
import type { ModuleExport, ModuleExports, Renderer } from '@storybook/types';
import { deprecate } from '@storybook/client-logger';
import dedent from 'ts-dedent';
import type { Layout, PreviewProps as PurePreviewProps } from '../components';
import { Preview as PurePreview, PreviewSkeleton } from '../components';
import type { DocsContextProps } from './DocsContext';
import { DocsContext } from './DocsContext';
import type { SourceContextProps } from './SourceContainer';
import { SourceContext } from './SourceContainer';
import type { SourceProps } from './Source';
import { useSourceProps, SourceState as DeprecatedSourceState, SourceState } from './Source';
import { useStories } from './useStory';
import type { StoryProps } from './Story';
import { getStoryId, Story } from './Story';
import { useOf } from './useOf';

export { DeprecatedSourceState as SourceState };

type DeprecatedCanvasProps = {
  /**
   * @deprecated multiple stories are not supported
   */
  isColumn?: boolean;
  /**
   * @deprecated multiple stories are not supported
   */
  columns?: number;
  /**
   * @deprecated use `sourceState` instead
   */
  withSource?: DeprecatedSourceState;
  /**
   * @deprecated use `source.code` instead
   */
  mdxSource?: string;
  /**
   * @deprecated reference stories with the `of` prop instead
   */
  children?: ReactNode;
};

type CanvasProps = Pick<PurePreviewProps, 'withToolbar' | 'additionalActions' | 'className'> & {
  /**
   * Pass the export defining a story to render that story
   *
   * ```jsx
   * import { Meta, Canvas } from '@storybook/blocks';
   * import * as ButtonStories from './Button.stories';
   *
   * <Meta of={ButtonStories} />
   * <Canvas of={ButtonStories.Primary} />
   * ```
   */
  of?: ModuleExport;
  /**
   * Pass all exports of the CSF file if this MDX file is unattached
   *
   * ```jsx
   * import { Canvas } from '@storybook/blocks';
   * import * as ButtonStories from './Button.stories';
   *
   * <Canvas of={ButtonStories.Primary} meta={ButtonStories} />
   * ```
   */
  meta?: ModuleExports;
  /**
   * Specify the initial state of the source panel
   * hidden: the source panel is hidden by default
   * shown: the source panel is shown by default
   * none: the source panel is not available and the button to show it is hidden
   * @default 'hidden'
   */
  sourceState?: 'hidden' | 'shown' | 'none';
  /**
   * how to layout the story within the canvas
   * padded: the story has padding within the canvas
   * fullscreen: the story is rendered edge to edge within the canvas
   * centered: the story is centered within the canvas
   * @default 'padded'
   */
  layout?: Layout;
  /**
   * @see {SourceProps}
   */
  source?: Omit<SourceProps, 'dark'>;
  /**
   * @see {StoryProps}
   */
  story?: Pick<StoryProps, 'inline' | 'height' | 'autoplay' | '__forceInitialArgs' | '__primary'>;
};

const useDeprecatedPreviewProps = (
  { withSource, mdxSource, children, ...props }: DeprecatedCanvasProps & { of?: ModuleExport },
  docsContext: DocsContextProps<Renderer>,
  sourceContext: SourceContextProps
) => {
  /*
  get all story IDs by traversing through the children,
  filter out any non-story children (e.g. text nodes)
  and then get the id from each story depending on available props
  */
  const storyIds = (Children.toArray(children) as ReactElement[])
    .filter((c) => c.props && (c.props.id || c.props.name || c.props.of))
    .map((c) => getStoryId(c.props, docsContext));

  const stories = useStories(storyIds, docsContext);
  const isLoading = stories.some((s) => !s);
  const sourceProps = useSourceProps(
    mdxSource ? { code: decodeURI(mdxSource), of: props.of } : { ids: storyIds, of: props.of },
    docsContext,
    sourceContext
  );
  if (withSource === SourceState.NONE) {
    return { isLoading, previewProps: props };
  }

  return {
    isLoading,
    previewProps: {
      ...props, // pass through columns etc.
      withSource: sourceProps,
      isExpanded: (withSource || sourceProps.state) === SourceState.OPEN,
    },
  };
};

export const Canvas: FC<CanvasProps & DeprecatedCanvasProps> = (props) => {
  const docsContext = useContext(DocsContext);
  const sourceContext = useContext(SourceContext);
  const { children, of, source } = props;
  const { isLoading, previewProps } = useDeprecatedPreviewProps(props, docsContext, sourceContext);
  let story;
  let sourceProps;
  /**
   * useOf and useSourceProps will throw if they can't find the story, in the scenario where
   * the doc is unattached (no primary story) and 'of' is undefined.
   * That scenario is valid in the deprecated API, where children is used as story refs rather than 'of'.
   * So if children is passed we allow the error to be swallowed and we'll use them instead.
   * We use two separate try blocks to not break the rules of hooks.
   */
  try {
    ({ story } = useOf(of || 'story', ['story']));
  } catch (error) {
    if (!children) {
      throw error;
    }
  }
  try {
    sourceProps = useSourceProps({ ...source, of }, docsContext, sourceContext);
  } catch (error) {
    if (!children) {
      throw error;
    }
  }

  if (props.withSource) {
    deprecate(dedent`Setting source state with \`withSource\` is deprecated, please use \`sourceState\` with 'hidden', 'shown' or 'none' instead. 
    
    Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#canvas-block'
    `);
  }
  if (props.mdxSource) {
    deprecate(dedent`Setting source code with \`mdxSource\` is deprecated, please use source={{code: '...'}} instead. 
    
    Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#canvas-block'
    `);
  }
  if (props.isColumn !== undefined || props.columns !== undefined) {
    deprecate(dedent`\`isColumn\` and \`columns\` props are deprecated as the Canvas block now only supports showing a single story. 
    
    Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#canvas-block'
    `);
  }
  if (children) {
    deprecate(dedent`Passing children to Canvas is deprecated, please use the \`of\` prop instead to reference a story. 
    
    Please refer to the migration guide: https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#canvas-block'
  `);
    return isLoading ? (
      <PreviewSkeleton />
    ) : (
      <PurePreview {...previewProps}>{children}</PurePreview>
    );
  }

  const layout =
    props.layout ?? story.parameters.layout ?? story.parameters.docs?.canvas?.layout ?? 'padded';
  const withToolbar = props.withToolbar ?? story.parameters.docs?.canvas?.withToolbar ?? false;
  const additionalActions =
    props.additionalActions ?? story.parameters.docs?.canvas?.additionalActions;
  const sourceState = props.sourceState ?? story.parameters.docs?.canvas?.sourceState ?? 'hidden';
  const className = props.className ?? story.parameters.docs?.canvas?.className;

  return (
    <PurePreview
      withSource={sourceState === 'none' ? undefined : sourceProps}
      isExpanded={sourceState === 'shown'}
      withToolbar={withToolbar}
      additionalActions={additionalActions}
      className={className}
    >
      <Story
        of={of || story.moduleExport}
        meta={props.meta}
        {...props.story}
        parameters={
          /**
           * this is a hack, Story v2 doesn't read from the "parameters" prop
           * But PurePreview determines the layout from it's first child's "parameters.layout" prop
           * So by passing the layout as a parameter, we can force the layout
           * TODO: remove this pattern once all the deprecated features can be removed
           */
          { layout }
        }
      />
    </PurePreview>
  );
};
