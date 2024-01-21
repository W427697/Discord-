import type {
  ArgsStoryFn,
  StoryContext as DefaultStoryContext,
  WebRenderer,
} from '@storybook/core/dist/modules/types/index';
import type { SourceType } from '@storybook/core/dist/modules/docs-tools/index';

export type { RenderContext } from '@storybook/core/dist/modules/types/index';

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
