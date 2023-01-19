import React, { Children, useContext } from 'react';
import type { FC, ReactElement, ReactNode } from 'react';
import type { ModuleExport, Renderer } from '@storybook/types';
import type { PreviewProps as PurePreviewProps } from '../components';
import { Preview as PurePreview, PreviewSkeleton } from '../components';
import type { DocsContextProps } from './DocsContext';
import { DocsContext } from './DocsContext';
import type { SourceContextProps } from './SourceContainer';
import { SourceContext } from './SourceContainer';
import { useSourceProps, SourceState as DeprecatedSourceState, SourceState } from './Source';
import { useStories } from './useStory';
import { getStoryId, Story } from './Story';

export { DeprecatedSourceState as SourceState };

const sourceStateMap: Record<CanvasProps['sourceState'], SourceState> = {
  shown: SourceState.OPEN,
  hidden: SourceState.CLOSED,
  none: SourceState.NONE,
};

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
  source?: any; // TODO: get from Source component (and or block) when that is ready
  story?: any; // TODO: get from Story component (and or block) when that is ready
};

const useDeprecatedPreviewProps = (
  { withSource, mdxSource, children, ...props }: DeprecatedCanvasProps,
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
    mdxSource ? { code: decodeURI(mdxSource) } : { ids: storyIds },
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
    source,
    withToolbar,
    additionalActions,
    className,
  } = props;
  const sourceProps = useSourceProps(
    {
      ...source,
      of,
      state: sourceStateMap[sourceState],
    },
    docsContext,
    sourceContext
  );
  const { isLoading, previewProps } = useDeprecatedPreviewProps(props, docsContext, sourceContext);

  if (of) {
    // TODO: loading?
    return (
      <PurePreview
        withSource={sourceProps}
        withToolbar={withToolbar}
        additionalActions={additionalActions}
        className={className}
      >
        <Story of={of} {...storyProps} />
      </PurePreview>
    );
  }
  if (!of && !children) {
    throw new Error('No story passed to the Canvas block. Did you forget to pass the `of` prop?');
  }

  if (isLoading) return <PreviewSkeleton />;

  return <PurePreview {...previewProps}>{children}</PurePreview>;
};
