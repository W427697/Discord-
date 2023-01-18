import type { FC, ComponentProps } from 'react';
import React, { useContext } from 'react';
import type {
  Renderer,
  ModuleExport,
  ModuleExports,
  PreparedStory,
  StoryAnnotations,
  StoryId,
} from '@storybook/types';
import { deprecate } from '@storybook/client-logger';

import { Story as PureStory, StorySkeleton } from '../components';
import type { DocsContextProps } from './DocsContext';
import { DocsContext } from './DocsContext';
import { useStory } from './useStory';

export const storyBlockIdFromId = (storyId: string) => `story--${storyId}`;

type PureStoryProps = ComponentProps<typeof PureStory>;

/**
 * Props to define a story
 *
 * @deprecated Define stories in CSF files
 */
type StoryDefProps = StoryAnnotations;

/**
 * Props to reference another story
 */
type StoryRefProps = {
  /**
   * @deprecated Use of={storyExport} instead
   */
  id?: string;
  /**
   * Pass the export defining a story to render that story
   *
   * ```jsx
   * import { Meta, Story } from '@storybook/blocks';
   * import * as ButtonStories from './Button.stories';
   *
   * <Meta of={ButtonStories} />
   * <Story of={ButtonStories.Primary} />
   * ```
   */
  of?: ModuleExport;
  /**
   * Pass all exports of the CSF file if this MDX file is unattached
   *
   * ```jsx
   * import { Story } from '@storybook/blocks';
   * import * as ButtonStories from './Button.stories';
   *
   * <Story of={ButtonStories.Primary} meta={ButtonStories} />
   * ```
   */
  meta?: ModuleExports;
};

type StoryParameters = {
  /**
   * Render the story inline or in an iframe
   */
  inline?: boolean;
  /**
   * When rendering in an iframe (`inline={false}`), set the story height
   */
  height?: string;
  /**
   * Whether to run the story's play function
   */
  autoplay?: boolean;
};

export type StoryProps = (StoryDefProps | StoryRefProps) & StoryParameters;

export const getStoryId = (props: StoryProps, context: DocsContextProps): StoryId => {
  const { id, of, meta } = props as StoryRefProps;

  if (of) {
    if (meta) context.referenceMeta(meta, false);
    const resolved = context.resolveModuleExport(of);
    if (resolved.type !== 'story') {
      throw new Error('Unexpected component/module/meta exports passed to `Story` block.');
    }
    return resolved.story.id;
  }

  const { name } = props as StoryDefProps;
  return id || context.storyIdByName(name);
};

// Find the first option that isn't undefined
function getProp<T>(...options: (T | undefined)[]) {
  return options.find((option) => typeof option !== 'undefined');
}

export const getStoryProps = <TFramework extends Renderer>(
  props: StoryParameters,
  story: PreparedStory<TFramework>,
  context: DocsContextProps<TFramework>
): PureStoryProps => {
  const { parameters = {} } = story || {};
  const { docs = {} } = parameters;
  const storyParameters = (docs.story || {}) as StoryParameters & { iframeHeight?: string };

  if (docs.disable) {
    return null;
  }

  // prefer block props, then story parameters defined by the framework-specific settings
  // and optionally overridden by users

  // Deprecated parameters
  const { inlineStories, iframeHeight } = docs as {
    inlineStories?: boolean;
    iframeHeight?: string;
    autoplay?: boolean;
  };
  if (typeof inlineStories !== 'undefined')
    deprecate('The `docs.inlineStories` parameter is deprecated, use `docs.story.inline` instead');
  const inline = getProp(props.inline, storyParameters.inline, inlineStories) || false;

  if (typeof iframeHeight !== 'undefined')
    deprecate(
      'The `docs.iframeHeight` parameter is deprecated, use `docs.story.iframeHeight` instead'
    );

  if (inline) {
    const height = getProp(props.height, storyParameters.height);
    const autoplay = getProp(props.autoplay, storyParameters.autoplay) || false;
    return {
      story,
      inline: true,
      height,
      autoplay,
      renderStoryToElement: context.renderStoryToElement,
    };
  }

  const height =
    getProp(props.height, storyParameters.height, storyParameters.iframeHeight, iframeHeight) ||
    '100px';
  return {
    story,
    inline: false,
    height,
  };
};

const Story: FC<StoryProps> = (props) => {
  const context = useContext(DocsContext);
  const storyId = getStoryId(props, context);
  const story = useStory(storyId, context);

  if (!story) {
    return <StorySkeleton />;
  }

  const storyProps = getStoryProps(props, story, context);
  if (!storyProps) {
    return null;
  }

  return (
    <div id={storyBlockIdFromId(story.id)} className="sb-story">
      <PureStory {...storyProps} />
    </div>
  );
};

export { Story };
