import { StoryFn, ClientStoryApi, Loadable } from '@storybook/addons';
import { TemplateResult } from 'lit-element';

export type StoryFnLitElementReturnType = TemplateResult | string | Node;

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface RenderMainArgs {
  storyFn: () => StoryFn<StoryFnLitElementReturnType>;
  selectedKind: string;
  selectedStory: string;
  showMain: () => void;
  showError: (args: ShowErrorArgs) => void;
  forceRender: boolean;
}

export interface IStorybookStory {
  name: string;
  render: () => any;
}

export interface IStorybookSection {
  kind: string;
  stories: IStorybookStory[];
}

export interface ClientApi extends ClientStoryApi<StoryFnLitElementReturnType> {
  setAddon(addon: any): void;
  configure(loader: Loadable, module: NodeModule): void;
  getStorybook(): IStorybookSection[];
  clearDecorators(): void;
  forceReRender(): void;
  raw: () => any;
  load: (...args: any[]) => void;
}
