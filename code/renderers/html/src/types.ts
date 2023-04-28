import type {
  ArgsStoryFn,
  StoryContext as DefaultStoryContext,
  WebRenderer,
} from '@junk-temporary-prototypes/types';

import type { parameters } from './config';

export type { RenderContext } from '@junk-temporary-prototypes/types';

export type StoryFnHtmlReturnType = string | Node;

export interface ShowErrorArgs {
  title: string;
  description: string;
}

/**
 * @deprecated Use `HtmlRenderer` instead.
 */
export type HtmlFramework = HtmlRenderer;
export interface HtmlRenderer extends WebRenderer {
  component: string | HTMLElement | ArgsStoryFn<HtmlRenderer>;
  storyResult: StoryFnHtmlReturnType;
}

export type StoryContext = DefaultStoryContext<HtmlRenderer> & {
  parameters: DefaultStoryContext<HtmlRenderer>['parameters'] & typeof parameters;
};
