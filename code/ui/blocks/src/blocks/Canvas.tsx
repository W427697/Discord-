import React, { Children, useContext } from 'react';
import type { FC, ReactElement, ReactNode } from 'react';
import type { ModuleExport, Renderer } from '@storybook/types';
import type { PreviewProps as PurePreviewProps } from '../components';
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

export { DeprecatedSourceState as SourceState };

type DeprecatedCanvasProps = Omit<
  PurePreviewProps,
  'isExpanded' | 'isLoading' | 'withToolbar' | 'additionalActions' | 'className'
> & {
  /**
   * @deprecated use `sourceState` instead
   */
  withSource?: DeprecatedSourceState;
  /**
   * @deprecated use `source.code` instead
   */
  mdxSource?: string;
  children?: ReactNode;
};

type CanvasProps = Pick<PurePreviewProps, 'withToolbar' | 'additionalActions' | 'className'> & {
  of: ModuleExport;
  sourceState?: 'hidden' | 'shown' | 'none';
  source?: Omit<SourceProps, 'dark'>;
  story?: Pick<StoryProps, 'inline' | 'height' | 'autoplay'>;
  layout?: 'padded' | 'centered' | 'fullscreen';
};

const useDeprecatedPreviewProps = (
  { withSource, mdxSource, children, ...props }: DeprecatedCanvasProps & { of: ModuleExport },
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
  const {
    children,
    of,
    story: storyProps,
    sourceState = 'hidden',
    layout: layoutProp,
    source,
    withToolbar,
    additionalActions,
    className,
  } = props;
  const sourceProps = useSourceProps(
    {
      ...source,
      of,
    },
    docsContext,
    sourceContext
  );
  const { isLoading, previewProps } = useDeprecatedPreviewProps(props, docsContext, sourceContext);

  if (!of && !children) {
    throw new Error('No story passed to the Canvas block. Did you forget to pass the `of` prop?');
  }

  if (of) {
    // TODO: loading?

    const layout =
      layoutProp || of.parameters?.layout || of.parameters?.docs?.canvas?.layout || 'padded';

    return (
      <PurePreview
        withSource={sourceState === 'none' ? undefined : sourceProps}
        isExpanded={sourceState === 'shown'}
        withToolbar={withToolbar}
        additionalActions={additionalActions}
        className={className}
      >
        <Story
          of={of}
          {...storyProps}
          parameters={
            /**
             * this is a hack, Story v2 doesn't read from the 2parameters" prop
             * But PurePreview determines the layout from it's first child's "parameters.layout" prop
             * So by passing the layout as a parameter, we can force the layout
             * TODO: remove this pattern once all the deprecated features can be removed
             */
            { layout }
          }
        />
      </PurePreview>
    );
  }

  if (isLoading) return <PreviewSkeleton />;

  return <PurePreview {...previewProps}>{children}</PurePreview>;
};
