import type { TemplateResult, SVGTemplateResult } from 'lit-html';

export type { RenderContext } from '@storybook/core';

export type StoryFnHtmlReturnType = string | Node | TemplateResult | SVGTemplateResult;

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export interface ShowErrorArgs {
  title: string;
  description: string;
}
