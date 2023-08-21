import React from 'react';
import { withLinks } from '@storybook/addon-links';

type Args = {
  content: string;
};

const Html = ({ content }: Args) => <div>{content}</div>;

export default {
  component: Html,
  parameters: {
    chromatic: { disable: true },
  },
  decorators: [withLinks],
  argTypes: {
    content: {
      control: {
        type: 'nativetextarea',
      },
    },
  },
};

export const Basic = {
  args: {
    content: `
      <div>
        <a class="link" href="#" data-sb-story="other">go to other</a>
      </div>
    `,
  },
};
export const Other = {
  args: {
    content: `
      <div>
        <a class="link" href="#" data-sb-story="third">go to third</a>
      </div>
    `,
  },
};
export const Third = {
  args: {
    content: `
      <div>
        <a class="link" href="#" data-sb-story="basic">go to basic</a>
      </div>
    `,
  },
};
