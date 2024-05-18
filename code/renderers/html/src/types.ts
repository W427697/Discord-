import type {
  ArgsStoryFn,
  StoryContext as DefaultStoryContext,
  WebRenderer,
} from '@storybook/core/dist/types';
import type { SourceType } from '@storybook/core/dist/docs-tools';

export type { RenderContext } from '@storybook/core/dist/types';

export type StoryFnHtmlReturnType = string | Node;

export interface ShowErrorArgs {
  title: string;
  description: string;
}

export interface HtmlRenderer extends WebRenderer {
  component: string | HTMLElement | ArgsStoryFn<HtmlRenderer>;
  storyResult: StoryFnHtmlReturnType;
}

export interface Parameters {
  renderer: 'html';
  docs?: {
    story: { inline: boolean };
    source: {
      type: SourceType.DYNAMIC;
      language: 'html';
      code: any;
      excludeDecorators: any;
    };
  };
}

export type StoryContext = DefaultStoryContext<HtmlRenderer> & {
  parameters: DefaultStoryContext<HtmlRenderer>['parameters'] & Parameters;
};
