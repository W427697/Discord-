import React from 'react';
import { SourceType } from '@storybook/docs-tools';
import type { Meta, StoryObj } from '@storybook/react';

import { Source } from './Source';
import * as ButtonStories from '../examples/Button.stories';
import { SourceContext } from './SourceContainer';

const meta: Meta<typeof Source> = {
  component: Source,
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories', '../blocks/Source.stories'],
    snippets: {
      'storybook-blocks-example-button--primary': { code: `const emitted = 'source';` },
      'storybook-blocks-blocks-source--type-story': { code: `const emitted = 'source';` },
    },
  },
  decorators: [
    (Story, { parameters: { snippets = {} } }) => (
      <SourceContext.Provider value={{ sources: snippets }}>
        <Story />
      </SourceContext.Provider>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof meta>;

const code = `query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }
`;
const render = () => <div>Story for reference</div>;

export const DefaultAttached = {};

export const Of: Story = {
  args: {
    of: ButtonStories.Primary,
  },
};

export const OfTypeProp: Story = {
  args: {
    of: ButtonStories.Primary,
    type: SourceType.CODE,
  },
};

// Render doesn't look at args so wouldn't render the dynamic snippet by default
export const TypeStory = {
  render,
  parameters: { docs: { source: { type: SourceType.DYNAMIC } } },
};

export const OfTypeParameter: Story = {
  args: {
    of: TypeStory,
  },
};

export const TransformSourceStory = {
  render,
  parameters: { docs: { source: { transformSource: () => `const transformed = "source";` } } },
};

export const OfTransformSourceParameter: Story = {
  args: {
    of: TransformSourceStory,
  },
};

export const OfUnattached: Story = {
  args: {
    of: ButtonStories.Primary,
  },
  parameters: { attached: false },
};

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
  render,
  parameters: { docs: { source: { code } } },
};

export const CodeParameters: Story = {
  args: { of: CodeStory },
};

export const CodeFormatStory = {
  render,
  parameters: { docs: { source: { code, format: true } } },
};

export const CodeFormatParameters: Story = {
  args: { of: CodeFormatStory },
};

export const CodeLanguageStory = {
  render,
  parameters: { docs: { source: { code, format: true, language: 'graphql' } } },
};

export const CodeLanguageParameters: Story = {
  args: { of: CodeLanguageStory },
};

export const CodeDarkStory = {
  parameters: { docs: { source: { code, dark: true } } },
};

export const CodeDarkParameters: Story = {
  args: { of: CodeDarkStory },
};
