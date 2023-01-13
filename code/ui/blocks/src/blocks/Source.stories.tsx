import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Source } from './Source';
import * as ButtonStories from '../examples/Button.stories';
import { SourceContext } from './SourceContainer';

const meta: Meta<typeof Source> = {
  component: Source,
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories', '../blocks/Source.stories'],
  },
  decorators: [
    (Story, { parameters: { sources = {} } }) => (
      <SourceContext.Provider value={{ sources }}>
        <Story />
      </SourceContext.Provider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultAttached = {};

// Still working on this
// export const Of: Story = {
//   args: {
//     of: ButtonStories.Primary,
//   },
//   parameters: {
//     sources: {
//       'storybook-blocks-example-button--primary': `
//         const emitted = 'source';
//       `,
//     },
//   },
// };

export const OfNoSnippet: Story = {
  args: {
    of: ButtonStories.Primary,
  },
};

export const OfUnattached: Story = {
  args: {
    of: ButtonStories.Primary,
  },
  parameters: { attached: false },
};

const code = `query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }
`;
export const Code: Story = {
  args: { code },
};

export const CodeFormat: Story = {
  args: {
    code,
    format: true,
  },
};

export const CodeLanguage: Story = {
  args: {
    code,
    language: 'graphql',
    format: true,
  },
};

export const Dark: Story = {
  args: { dark: true },
};

export const CodeStory = {
  render: () => <div>Story for reference</div>,
  parameters: { docs: { source: { code } } },
};

export const CodeParameters: Story = {
  args: { of: CodeStory },
};

export const CodeFormatStory = {
  ...CodeStory,
  parameters: { docs: { source: { code, format: true } } },
};

export const CodeFormatParameters: Story = {
  args: { of: CodeFormatStory },
};

export const CodeLanguageStory = {
  ...CodeStory,
  parameters: { docs: { source: { code, format: true, language: 'graphql' } } },
};

export const CodeLanguageParameters: Story = {
  args: { of: CodeLanguageStory },
};

export const CodeDarkStory = {
  ...CodeStory,
  parameters: { docs: { source: { code, dark: true } } },
};

export const CodeDarkParameters: Story = {
  args: { of: CodeDarkStory },
};
