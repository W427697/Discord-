import type { Meta, StoryObj } from '@storybook/react';
import { SourceType } from '@storybook/docs-tools';

import type { PreparedStory } from '@storybook/types';

import dedent from 'ts-dedent';
import { EmptyExample } from './EmptyExample';

const code = `query HeroNameAndFriends($episode: Episode) {
          hero(episode: $episode) {
            name
            friends {
              name
            }
          }
        }
`;

const meta = {
  title: 'examples/Stories for the Source Block',
  component: EmptyExample,
} satisfies Meta<typeof EmptyExample>;
export default meta;

type Story = StoryObj<typeof meta>;

export const NoParameters: Story = {
  // This is here so we can tell if we are looking at the real vs emitted source
};

export const TypeCode: Story = {
  parameters: { docs: { source: { type: SourceType.CODE } } },
};

export const Transform = {
  parameters: {
    docs: {
      source: {
        transform: (
          src: string,
          story: PreparedStory
        ) => dedent`// this comment has been added via parameters.docs.source.transform!
    // this is the story id: ${story.id}
    ${src}`,
      },
    },
  },
};

// deprecated
export const SourceTransformSource = {
  parameters: {
    docs: {
      source: {
        transformSource: (
          src: string,
          story: PreparedStory
        ) => dedent`// this comment has been added via parameters.docs.source.transformSource!
    // this is the story id: ${story.id}
    ${src}`,
      },
    },
  },
};

// deprecated
export const DocsTransformSource = {
  parameters: {
    docs: {
      transformSource: (
        src: string,
        story: PreparedStory
      ) => dedent`// this comment has been added via parameters.docs.transformSource!
  // this is the story id: ${story.id}
  ${src}`,
    },
  },
};

export const Code = {
  parameters: { docs: { source: { code } } },
};

export const CodeFormat = {
  parameters: { docs: { source: { code, format: true } } },
};

export const CodeLanguage = {
  parameters: { docs: { source: { code, format: true, language: 'graphql' } } },
};

export const CodeDark = {
  parameters: { docs: { source: { code, dark: true } } },
};
