import { ReactElement } from 'react';
import { StoryFn } from '@storybook/addons';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface RenderMainArgs {
  storyFn: StoryFn<ReactElement<unknown>>;
  selectedKind: string;
  selectedStory: string;
  showMain: () => void;
  showError: (args: ShowErrorArgs) => void;
  forceRender: boolean;
}

export type StoryFnReactReturnType = ReactElement<unknown>;

export interface ICollection {
  [p: string]: any;
}

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}
