import { Context, createContext } from 'react';
import { Channel } from '@storybook/channels';

export interface DocsContextProps {
  id?: string;
  selectedKind?: string;
  selectedStory?: string;
  channel?: Channel;
  /**
   * mdxStoryNameToKey is an MDX-compiler-generated mapping of an MDX story's
   * display name to its story key for ID generation. It's used internally by the `<Story>`
   * and `Preview` doc blocks.
   */
  mdxStoryNameToKey?: Record<string, string>;
  mdxComponentMeta?: any;
  parameters?: any;
  storyStore?: any;
  forceRender?: () => void;
}

export const DocsContext: Context<DocsContextProps> = createContext({});
