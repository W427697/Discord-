import { RiotComponent } from 'riot';

export type { RenderContext } from '@storybook/core';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnRiotReturnType = Partial<RiotComponent> & {
  template?: string
}

export interface IStorybookStory {
  name: string;
  render: (context: any) => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}
