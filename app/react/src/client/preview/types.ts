import React from 'react';

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export type StoryFnReactReturnType = React.ElementType;

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
